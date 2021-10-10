import { ShoppingRepository } from '../shopping-repository.service';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from '@angular/router';
import { Shopping } from '../shopping';
import { ShoppingDatasource } from '../shopping-datasource.service';

@Component({
    selector: 'app-shopping-create',
    templateUrl: './shopping-create.component.html',
    styleUrls: ['shopping-create-component.css']
})
export class ShoppingCreateComponent {

    createShoppingForm!: FormGroup;

    @ViewChild('shoppingNameInput') shoppingNameInput!: ElementRef<HTMLInputElement>;

    private userName: string = '';

    constructor(
        private shoppingRepository: ShoppingRepository,
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder) {
    }

    ngOnInit(): void {
        this.userName = this.activatedRoute.snapshot.params.userName;

        this.createShoppingForm = this.formBuilder.group({
            shoppingName: [
                '',
                [Validators.required, Validators.minLength(2), this.shoppingRepository.isShoppingNameTaken()],
                ''
            ]
        });
    }

    addShopping(): void {

        const shopping = this.createShoppingForm.getRawValue() as Shopping;

        shopping.userName = this.userName;
        shopping.shoppingName = shopping.shoppingName.toLowerCase().trim();

        this.shoppingRepository.addShopping(this.userName, shopping);
        this.createShoppingForm.reset();
        this.shoppingNameInput.nativeElement.focus();

    }

    getErrorMessage(field: string): string {
        if (this.createShoppingForm.get(field)?.hasError('required')) {
            return 'Required field';
        }

        if (this.createShoppingForm.get(field)?.hasError('minlength')) {
            return `Minimum size: ${this.createShoppingForm.get(field)?.errors?.minlength.requiredLength}`;
        }

        if (this.createShoppingForm.get(field)?.hasError('shoppingNameTaken')) {
            return `This shopping list already exists`;
        }

        return this.createShoppingForm.get(field)?.invalid ? `Invalid field ${field}` : '';

    }



}