import { ShoppingDatasource } from './shopping-datasource.service';
import { Injectable, OnDestroy } from "@angular/core";
import { Shopping } from './shopping';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractControl } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class ShoppingRepository implements OnDestroy {

    private shoppings: Shopping[] = [];

    private shoppingsSubject = new BehaviorSubject<Shopping[]>(this.shoppings);

    constructor(private shoppingDatasource: ShoppingDatasource) { }

    ngOnDestroy(): void {
        this.shoppingsSubject.unsubscribe();
    }

    getShoppings(userName: string): Observable<Shopping[]> {
        return this.shoppingsSubject.asObservable();
    }

    loadShoppings(userName: string): void {
        this.shoppingDatasource.list(userName)
            .subscribe(shoppings => {
                this.shoppings = shoppings;
                this.shoppingsSubject.next(this.shoppings);
            });
    }

    addShopping(userName: string, shopping: Shopping): void {
        this.shoppingDatasource.create(userName, shopping).subscribe(shopping =>
            this.loadShoppings(userName)
        );
    }

    updateShopping(userName: string, originalShoppingName: string, shopping: Shopping): void {
        this.shoppingDatasource.update(userName, originalShoppingName, shopping).subscribe(shopping =>
            this.loadShoppings(userName)
        );
    }

    isShoppingNameTaken() {
        return (control: AbstractControl) => {
            const shoppingName: string = control.value;
            const index: number = this.shoppings.findIndex(p => p.shoppingName === shoppingName?.toLowerCase());
            if (index === -1) {
                return null;
            } else {
                return { shoppingNameTaken: true };
            }
        }
    }    



}