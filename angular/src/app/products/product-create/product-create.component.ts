import { TitleCasePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../product';
import { ProductRepositoryService } from '../product-repository.service';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css'],
  providers: [TitleCasePipe]
})
export class ProductCreateComponent implements OnInit {

  createProductForm!: FormGroup;

  @ViewChild('productNameInput') productNameInput!: ElementRef<HTMLInputElement>;

  private userName: string = '';

  private shoppingName: string = '';

  constructor(
    private productRepositoryService: ProductRepositoryService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {


    this.activatedRoute.params.subscribe(params => {
      this.userName = params.userName;
      this.shoppingName = params.shoppingName;
    });

    this.createProductForm = this.formBuilder.group({
      productName: [
        '',
        [Validators.required, Validators.minLength(2), this.productRepositoryService.isProductNameTaken()],
        ''
      ],
      quantity: [
        '1'
      ]
    });
  }

  addProduct(formDirective: FormGroupDirective): void {

    const product = this.createProductForm.getRawValue() as Product;

    product.userName = this.userName;
    product.shoppingName = this.shoppingName;
    product.checked = false;
    product.productName = product.productName.toLowerCase().trim();

    this.productRepositoryService.addProduct(this.userName, this.shoppingName, product);

    // formDirective. resetForm();

    this.createProductForm.reset({ quantity: '1' });

    this.productNameInput.nativeElement.focus();

  }

  getErrorMessage(field: string): string {
    if (this.createProductForm.get(field)?.hasError('required')) {
      return 'Required field';
    }

    if (this.createProductForm.get(field)?.hasError('minlength')) {
      return `Minimum size: ${this.createProductForm.get(field)?.errors?.minlength.requiredLength}`;
    }

    if (this.createProductForm.get(field)?.hasError('productNameTaken')) {
      return `Este item já está na lista.`;
    }

    return this.createProductForm.get(field)?.invalid ? `Invalid field ${field}` : '';

  }

}
