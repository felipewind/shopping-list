import { CommonModule, TitleCasePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ShoppingModule } from './../shoppings/shopping.module';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductDataSourceService } from './product-datasource.service';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductRepositoryService } from './product-repository.service';
import { ProductComponent } from './product/product.component';

@NgModule({
    declarations: [
        ProductCreateComponent,
        ProductListComponent,
        ProductComponent
    ],
    providers: [
        ProductDataSourceService,
        ProductRepositoryService,
        TitleCasePipe
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        SharedModule,        
        ShoppingModule
    ]
})
export class ProductModule { }