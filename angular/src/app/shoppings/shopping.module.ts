import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ShoppingCreateComponent } from './shopping-create/shopping-create.component';
import { ShoppingDeleteComponent } from './shopping-delete/shopping-delete.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ShoppingSelectComponent } from './shopping-select/shopping-select.component';
import { ShoppingUpdateComponent } from './shopping-upate/shopping-update.component';
import { ShoppingComponent } from './shopping/shopping.component';

@NgModule({
    declarations: [
        ShoppingSelectComponent,
        ShoppingListComponent,
        ShoppingComponent,
        ShoppingCreateComponent,
        ShoppingUpdateComponent,
        ShoppingDeleteComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        ShoppingSelectComponent
    ]
})
export class ShoppingModule { }