import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShoppingDatasource } from './../shopping-datasource.service';

@Component({
  selector: 'app-shopping-delete',
  templateUrl: './shopping-delete.component.html',
  styleUrls: ['./shopping-delete.component.css']
})
export class ShoppingDeleteComponent implements OnInit {

  private userName: string = '';
  shoppingName: string = '';

  constructor(
    private shoppingDatasource: ShoppingDatasource,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.userName = this.activatedRoute.snapshot.params.userName;
    this.shoppingName = this.activatedRoute.snapshot.params.shoppingNameDelete;
  }

  delete(): void {
    this.shoppingDatasource.delete(this.userName, this.shoppingName)
      .subscribe(() => this.navigateToShoppingList());
  }

  cancel(): void {
    this.navigateToShoppingList();
  }

  navigateToShoppingList(): void {
    this.router.navigate(['users', this.userName, 'shoppings']);
  }

}
