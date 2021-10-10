import {
    HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserAuthService } from '../user/user-auth.service';

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {
    constructor(private userAuthService: UserAuthService, private router: Router) { }

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            catchError((err) => {
                if (err.status === 401) {
                    this.userAuthService.logout();
                    this.router.navigate([''], {
                        queryParams: { returnUrl: this.router.routerState.snapshot.url },
                    });
                }

                if (!environment.production) {
                    console.error(err);
                }
                const error = (err && err.error && err.error.message) || err.statusText;
                return throwError(error);
            })
        );
    }
}
