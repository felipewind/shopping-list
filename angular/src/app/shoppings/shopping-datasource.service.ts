import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Shopping } from './shopping';

@Injectable({
    providedIn: 'root'
})
export class ShoppingDatasource {

    constructor(private http: HttpClient) { }

    get(userName: string, shoppingName: string): Observable<Shopping> {
        const url = `${environment.apiUrl}/users/${userName}/shoppings`;
        return this.http.get<Shopping>(url);
    }

    list(userName: String): Observable<Shopping[]> {
        const url = `${environment.apiUrl}/users/${userName}/shoppings`;
        return this.http.get<Shopping[]>(url);
    }    

    create(userName: string, shopping: Shopping): Observable<Shopping> {
        const url = `${environment.apiUrl}/users/${userName}/shoppings`;
        return this.http.post<Shopping>(url, shopping);
    }    

    update(userName: string, originalShoppingName: string, shopping: Shopping): Observable<Shopping> {
        const url = `${environment.apiUrl}/users/${userName}/shoppings/${originalShoppingName}`;
        return this.http.put<Shopping>(url, shopping);
    }

    delete(userName: string, shoppingName: string): Observable<any> {
        const url = `${environment.apiUrl}/users/${userName}/shoppings/${shoppingName}`;
        return this.http.delete(url);
    }


}