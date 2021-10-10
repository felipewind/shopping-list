import { Injectable, OnDestroy } from "@angular/core";
import { AbstractControl } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product';
import { ProductDataSourceService } from './product-datasource.service';


@Injectable()
export class ProductRepositoryService implements OnDestroy {

    private products: Product[] = [];

    private productsSubject = new BehaviorSubject<Product[]>(this.products);

    constructor(
        private productDataSourceService: ProductDataSourceService
        ) {
    }

    ngOnDestroy(): void {
        this.productsSubject.unsubscribe();
    }

    getProducts(userName: string, shoppingName: string): Observable<Product[]> {
        this.loadProducts(userName, shoppingName);
        return this.productsSubject.asObservable();
    }

    loadProducts(userName: string, shoppingName: string): void {
        this.productDataSourceService.list(userName, shoppingName).subscribe((products) => {
            this.products = products;
            this.productsSubject.next(this.products);
        });
    }

    addProduct(userName: string, shoppingName: string, product: Product): void {
        this.productDataSourceService.create(userName, shoppingName, product).subscribe((p) => { });
        this.addProductIntoProducts(product);
        this.productsSubject.next(this.products);
    }

    updateProduct(userName: string, shoppingName: string, product: Product): void {
        this.productDataSourceService.update(userName, shoppingName, product).subscribe((p) => { });
        this.updateProductIntoProducts(product);
        this.productsSubject.next(this.products);
    }

    checkProduct(userName: string, shoppingName: string, product: Product): void {
        this.productDataSourceService.update(userName, shoppingName, product).subscribe((p) => { });
        this.removeProductFromProducts(product);
        this.addProductIntoProducts(product);
        this.productsSubject.next(this.products);
    }

    deleteProduct(userName: string, shoppingName: string, product: Product): void {
        this.productDataSourceService.delete(userName, shoppingName, product).subscribe(() => { });
        this.removeProductFromProducts(product);
        this.productsSubject.next(this.products);
    }

    isProductNameTaken() {
        return (control: AbstractControl) => {
            const productName: string = control.value;
            const index: number = this.products.findIndex(p => p.productName === productName?.toLowerCase());
            if (index === -1) {
                return null;
            } else {
                return { productNameTaken: true };
            }
        }
    }

    clear() {        
        this.productsSubject.next([]);
    }

    private addProductIntoProducts(product: Product): void {
        let index = this.products.findIndex(p => {

            let result: boolean = false;

            if (product.checked === p.checked) {
                result = product.productName < p.productName;
            }

            if (product.checked === false && p.checked === true) {
                result = true;
            }

            return result;
        });
        if (index === -1) {
            index = this.products.length;
        }
        this.products.splice(index, 0, product);
    }

    private updateProductIntoProducts(product: Product): void {
        let index = this.products.findIndex(p => p.productName === product.productName);

        if (index >= 0) {
            this.products[index] = product;
        }
    }

    private removeProductFromProducts(product: Product): void {
        let index = this.products.findIndex(p => p.productName === product.productName);

        if (index >= 0) {
            this.products.splice(index, 1);
        }
    }

}