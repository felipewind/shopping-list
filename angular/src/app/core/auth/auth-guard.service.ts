
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { UserAuthService } from "../user/user-auth.service";

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {

    constructor(
        private userAuthService: UserAuthService,
        private router: Router) {
    }

    canActivate(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    
            if (this.userAuthService.isLogged()) {
                const userName: string = this.userAuthService.getUserName();
                this.router.navigate(['users', userName, 'shoppings'])
                return false;
            }            
            
            return true;
    }

}