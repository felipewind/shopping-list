import { Component, OnInit } from '@angular/core';
import { Header, HeaderType } from 'src/app/core/header/header';
import { HeaderService } from 'src/app/core/header/header.service';
import { Shopping } from './../shopping';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.css']
})
export class ShoppingComponent implements OnInit {

  updatingShopping = false;

  shoppingToUpdate!: Shopping;

  constructor(headerService: HeaderService) {
    const header: Header = {
      headerType: HeaderType.SHOPPING
    }
    headerService.setHeader(header);
  }

  ngOnInit(): void {
  }

  updateShopping(shopping: Shopping) {
    this.updatingShopping = true;
    this.shoppingToUpdate = shopping;
  }

  updateDone(updateDone: boolean) {
    this.updatingShopping = false;
  }

}
