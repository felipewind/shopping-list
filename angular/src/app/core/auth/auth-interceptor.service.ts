import { Product } from '../../products/product';
import { TokenService } from './../token/token.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private tokenService: TokenService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (!this.tokenService.hasToken()) {
            return next.handle(req);
        }

        const secureRec = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${this.tokenService.getToken()}`),
        });

        return next.handle(secureRec);

    }
}