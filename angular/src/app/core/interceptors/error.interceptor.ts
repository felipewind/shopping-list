import {
    HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertService } from './../../shared/alert.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private alertService: AlertService) { }

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            catchError((err) => {

                switch (true) {
                    case (err.status >= 500):
                        {
                            this.alertService.showMessage(`Server error=[${err.status}]`, true);
                            break;
                        }
                    case ((err.status >= 400 && err.status < 500)):
                        {
                            if (err.status != 401) {
                                this.alertService.showMessage(`Client error=[${err.status}]`, true);
                            }
                            break;
                        }
                    default: {
                        this.alertService.showMessage(`Sorry, there's something wrong with the system. Please try again later.`, true);
                        break;
                    }
                }

                return throwError(err);
            })
        );
    }
}
