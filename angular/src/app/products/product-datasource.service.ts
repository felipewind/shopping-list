import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { Product } from './product';

@Injectable()
export class ProductDataSourceService {    

    constructor(private http: HttpClient) {
    }

    create(userName: string, shoppingName: string, product: Product): Observable<Product> {
        const url = `${environment.apiUrl}/users/${userName}/shoppings/${shoppingName}/products`;
        return this.http.post<Product>(url, product);
    }

    list(userName: string, shoppingName: string): Observable<Product[]> {
        const url = `${environment.apiUrl}/users/${userName}/shoppings/${shoppingName}/products`;
        return this.http.get<Product[]>(url);
    }

    update(userName: string, shoppingName: string, product: Product): Observable<Product> {
        const url = `${environment.apiUrl}/users/${userName}/shoppings/${shoppingName}/products/${product.productName}`;
        return this.http.put<Product>(url, product);
    }

    delete(userName: string, shoppingName: string, product: Product): Observable<any> {
        const url = `${environment.apiUrl}/users/${userName}/shoppings/${shoppingName}/products/${product.productName}`;
        return this.http.delete<Product>(url);
    }

}
