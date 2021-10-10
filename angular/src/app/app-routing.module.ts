import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './core/auth/auth-guard.service';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { LoginComponent } from './home/login/login.component';
import { SignUpComponent } from './home/signup/signup.component';
import { ProductComponent } from './products/product/product.component';
import { ShoppingDeleteComponent } from './shoppings/shopping-delete/shopping-delete.component';
import { ShoppingComponent } from './shoppings/shopping/shopping.component';


const routes: Routes = [
  {
    path: "",
    component: LoginComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "signup",
    component: SignUpComponent
  },
  {
    path: "users/:userName/shoppings",
    component: ShoppingComponent
  },  
  {
    path: "users/:userName/shoppings/:shoppingNameDelete/delete",
    component: ShoppingDeleteComponent
  },  
  {
    path: "users/:userName/shoppings/:shoppingName/products",
    component: ProductComponent
  },
  {
    path: "**",
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
