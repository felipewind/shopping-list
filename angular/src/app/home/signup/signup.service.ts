import { NewUser } from './new-user.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { UserNameTaken } from './user-name-taken.model';
import { environment } from 'src/environments/environment';
import { HeaderService } from 'src/app/core/header/header.service';
import { Header, HeaderType } from 'src/app/core/header/header';

@Injectable({ providedIn: 'root' })
export class SignUpService {

    constructor(
        private http: HttpClient,
        headerService: HeaderService) {

        const header: Header = {
            headerType: HeaderType.SIGNUP
        }

        headerService.setHeader(header);

    }

    checkUserNameTaken(userName: string): Observable<UserNameTaken> {
        return this.http.get<UserNameTaken>(`${environment.apiUrl}/users/exist/${userName}`);
    }

    createNewUser(newUser: NewUser): Observable<any> {
        return this.http.post(`${environment.apiUrl}/users`, newUser);
    }

}