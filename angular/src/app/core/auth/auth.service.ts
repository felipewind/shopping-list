import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserAuthService } from '../user/user-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private userService: UserAuthService
  ) { }

  authenticate(userName: string, password: string): Observable<any> {

    const API_URL = `${environment.apiUrl}/users/login`;

    return this.http
      .post<{ jwt: string }>(API_URL, { userName, password }).
      pipe(tap(res => {
        const authToken: string = res.jwt;
        this.userService.setToken(authToken);
      }));

  }

}
