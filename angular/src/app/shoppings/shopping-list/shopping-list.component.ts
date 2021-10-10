import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Shopping } from '../shopping';
import { ShoppingRepository } from '../shopping-repository.service';

@Component({
    templateUrl: './shopping-list.component.html',
    styleUrls: ['./shopping-list.component.css'],
    selector: 'app-shopping-list'
})
export class ShoppingListComponent implements OnInit {

    @Output() updateShopping = new EventEmitter<Shopping>();

    shoppings: Shopping[] = [];
    displayedColumns: string[] = ['name', 'action'];

    private userName: string = '';

    constructor(
        private shoppingRepository: ShoppingRepository,
        private activatedRoute: ActivatedRoute,
        private router: Router) { }

    ngOnInit(): void {
        
        this.userName = this.activatedRoute.snapshot.params.userName;
        
        this.shoppingRepository.loadShoppings(this.userName);
        
        this.shoppingRepository
            .getShoppings(this.userName)
            .subscribe(shoppings => this.shoppings = shoppings.slice());
    }

    accessShopping(shopping: Shopping): void {
        this.router.navigate(['users', this.userName, 'shoppings', shopping.shoppingName, 'products']);
    }

    update(shopping: Shopping): void {
        this.updateShopping.emit(shopping);
    }

    delete (shopping: Shopping): void {
        this.router.navigate(['users', this.userName, 'shoppings', shopping.shoppingName, 'delete']);
    }

}