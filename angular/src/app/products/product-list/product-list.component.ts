import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Product } from '../product';
import { ProductRepositoryService } from '../product-repository.service';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {

    products: Product[] = [];
    displayedColumns: string[] = ['checked', 'name', 'quantity', 'action'];

    private userName: string = '';
    private shoppingName: string = '';

    constructor(
        private productRepositoryService: ProductRepositoryService,
        private activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {

        this.activatedRoute.params.subscribe(params => {
            this.userName = params.userName;
            this.shoppingName = params.shoppingName;

            this.productRepositoryService.getProducts(this.userName, this.shoppingName).subscribe((products) => {
                // the slice is just to force the template to update the product object
                this.products = products?.slice();
            });
        });


    }

    ngOnDestroy(): void {
        this.productRepositoryService.clear();
    }

    checkProduct(checked: boolean, product: Product): void {
        product.checked = checked;
        this.productRepositoryService.checkProduct(this.userName, this.shoppingName, product);
    }

    deleteProduct(product: Product): void {
        this.productRepositoryService.deleteProduct(this.userName, this.shoppingName, product);
    }

    incrementQuantity(product: Product): void {
        product.quantity++;
        this.productRepositoryService.updateProduct(this.userName, this.shoppingName, product);
    }

    decrementQuantity(product: Product): void {
        product.quantity--;
        this.productRepositoryService.updateProduct(this.userName, this.shoppingName, product);
    }

    decrementAllowed(product: Product): boolean {
        if (product.quantity <= 1) {
            return false;
        } else {
            return true;
        }
    }

}