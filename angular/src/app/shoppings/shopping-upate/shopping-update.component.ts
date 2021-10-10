import { TitleCasePipe } from "@angular/common";
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Shopping } from "../shopping";
import { ShoppingRepository } from "../shopping-repository.service";

@Component({
    selector: 'app-shopping-update',
    templateUrl: './shopping-update.component.html',
    styleUrls: ['shopping-update.component.css'],
    providers: [TitleCasePipe]
})
export class ShoppingUpdateComponent implements OnInit, OnChanges {

    updateShoppingForm!: FormGroup;

    @Input() originalShopping!: Shopping;
    @Output() updateDone = new EventEmitter<boolean>();

    private userName: string = '';

    constructor(
        private shoppingRepository: ShoppingRepository,
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private titlecasePipe: TitleCasePipe) {
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.originalShopping) {
            this.userName = this.activatedRoute.snapshot.params.userName;

            this.updateShoppingForm = this.formBuilder.group({
                shoppingName: [
                    this.titlecasePipe.transform(this.originalShopping.shoppingName),
                    [Validators.required, Validators.minLength(2), this.shoppingRepository.isShoppingNameTaken()],
                    ''
                ]
            });    
        }
    }

    updateShopping(): void {

        const shopping = this.updateShoppingForm.getRawValue() as Shopping;

        shopping.userName = this.userName;
        shopping.shoppingName = shopping.shoppingName.toLowerCase().trim();

        this.shoppingRepository.updateShopping(this.userName, this.originalShopping.shoppingName, shopping);
        
        this.updateDone.emit(true);

    }

    cancelUpdate(): void {
        this.updateDone.emit(false);
    }

    getErrorMessage(field: string): string {
        if (this.updateShoppingForm.get(field)?.hasError('required')) {
            return 'Required field';
        }

        if (this.updateShoppingForm.get(field)?.hasError('minlength')) {
            return `Minimum size deve ser ${this.updateShoppingForm.get(field)?.errors?.minlength.requiredLength}`;
        }

        if (this.updateShoppingForm.get(field)?.hasError('shoppingNameTaken')) {
            return `Name not modified`;
        }

        return this.updateShoppingForm.get(field)?.invalid ? `Invalid field ${field}` : '';

    }

}