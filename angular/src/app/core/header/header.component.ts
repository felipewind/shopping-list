import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, switchMap } from 'rxjs/operators';
import { Header, HeaderType } from 'src/app/core/header/header';
import { Shopping } from 'src/app/shoppings/shopping';
import { UserAuthService } from '../user/user-auth.service';
import { ShoppingRepository } from './../../shoppings/shopping-repository.service';
import { UserAuth } from './../user/user-auth';
import { HeaderService } from './header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  userAuth!: UserAuth | null;

  isListingProducts = false;

  shoppingName = '';
  userName = '';
  shoppings: Shopping[] = [];

  header: Header = { headerType: HeaderType.LOGIN };

  constructor(
    private userAuthService: UserAuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private shoppingRepository: ShoppingRepository,
    private headerService: HeaderService) {
  }

  ngOnInit(): void {
    this.userAuthService.getUser().subscribe(userAuth => {
      this.userAuth = userAuth;
      if (userAuth) {
        this.shoppingRepository.loadShoppings(userAuth.upn);
      }
    });

    this.headerService.getHeader().subscribe(header => {
      this.header = header;
      if (header.headerType == HeaderType.PRODUCT) {
        this.isListingProducts = true;
        this.productListing();
      } else {
        this.isListingProducts = false;
      }
    });
  }

  productListing(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .pipe(map(() => this.activatedRoute))
      .pipe(map(activatedRoute => {
        while (activatedRoute.firstChild) {
          activatedRoute = activatedRoute.firstChild;
        }
        return activatedRoute;
      }))
      .pipe(switchMap(activatedRoute => activatedRoute.params))
      .subscribe(params => {
        this.shoppingName = params.shoppingName;
        this.userName = params.user;
        this.loadShoppingList();
      });
  }

  loadShoppingList() {
    this.shoppingRepository
      .getShoppings(this.userName)
      .subscribe(shoppings => {
        this.shoppings = shoppings;
      });
  }

  ngOnDestroy(): void {
  }

  logout(): void {
    this.userAuthService.logout();
    this.router.navigate(['']);
  }

  back(): void {
    this.router.navigate(['']);
  }

  changeShopping(shopping: Shopping): void {
    this.router.navigate(['users', shopping.userName, 'shoppings', shopping.shoppingName, 'products']);
  }

}
