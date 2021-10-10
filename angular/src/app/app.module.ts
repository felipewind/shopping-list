import { ShoppingModule } from './shoppings/shopping.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { ErrorsModule } from './errors/errors.module';
import { HomeModule } from './home/home.module';
import { ProductModule } from './products/product.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ProductModule,
    HomeModule,
    CoreModule,
    ErrorsModule,
    ShoppingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
