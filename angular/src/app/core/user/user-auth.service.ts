import { UserAuth } from './user-auth';
import { TokenService } from '../token/token.service';
import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';

@Injectable({
    providedIn: 'root'
})
export class UserAuthService {

    private userSubject = new BehaviorSubject<UserAuth | null>(null);
    private userName!: string;

    constructor(private tokenService: TokenService) {
        if (tokenService.hasToken()) {
            this.decodeAndNotify();
        }
    }

    setToken(token: string): void {
        this.tokenService.setToken(token);
        this.decodeAndNotify();
    }

    getUser(): Observable<UserAuth | null> {
        return this.userSubject.asObservable();
    }

    private decodeAndNotify(): void  {
        const token = this.tokenService.getToken();
        if (token) {
            const userAuth = jwt_decode(token) as UserAuth;
            this.userName = userAuth.upn;
            this.userSubject.next(userAuth);
        }
    }

    logout(): void {
        this.tokenService.removeToken();
        this.userSubject.next(null);
    }

    isLogged(): boolean {
        return this.tokenService.hasToken();
    }

    getUserName(): string {
        return this.userName;
    }

}