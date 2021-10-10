import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Shopping } from './../../shoppings/shopping';

@Component({
  selector: 'app-header-shopping',
  templateUrl: './header-shopping.component.html',
  styleUrls: ['./header-shopping.component.css']
})
export class HeaderShoppingComponent implements OnInit {

  @Input() shoppings: Shopping[] = [];
  @Input() currentShoppingName: string = '';  
  @Output() changeShopping = new EventEmitter<Shopping>();

  constructor() { }

  ngOnInit(): void {
  }

  selectShoppingName(shopping: Shopping): void {
    this.changeShopping.emit(shopping);
  }

}
