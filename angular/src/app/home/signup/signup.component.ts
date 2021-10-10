import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NewUser } from "./new-user.model";
import { SignUpService } from './signup.service';
import { UserNotTakenValidatorService } from "./user-not-taken.validator.service";

@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignUpComponent implements OnInit {

    signUpForm!: FormGroup;

    @ViewChild('userNameInput') userNameInput!: ElementRef<HTMLInputElement>;

    constructor(
        private formBuilder: FormBuilder,
        private signUpService: SignUpService,
        private router: Router,
        private userNotTakenValidatorService: UserNotTakenValidatorService) {
    }

    ngOnInit(): void {
        this.signUpForm = this.formBuilder.group({
            userName: [
                '',
                [Validators.required, Validators.minLength(3)],
                this.userNotTakenValidatorService.checkUserNameTaken()
            ],
            password: [
                '',
                [Validators.required, Validators.minLength(3)]
            ]
        });

    }

    signup(): void {

        const newUser = this.signUpForm.getRawValue() as NewUser;

        newUser.userName = newUser.userName.toLowerCase().trim();

        this.signUpService
            .createNewUser(newUser)
            .subscribe(
                () => {
                    this.router.navigate(['']);
                },
                (error) => {
                    this.signUpForm.reset();
                    alert('Alguma coisa errada aconteceu');
                }

            );

    }

    getErrorMessage(field: string): string {        
        if (this.signUpForm.get(field)?.hasError('required')) {
            return 'Required field';
        }

        if (this.signUpForm.get(field)?.hasError('minlength')) {
            return `Minimum size ${this.signUpForm.get(field)?.errors?.minlength.requiredLength}`;
        }

        if (this.signUpForm.get(field)?.hasError('userNameTaken')) {
            return 'Usuário já existente, por favor escolha outro';
        }        

        return this.signUpForm.get(field)?.invalid ? `Invalid field ${field}` : '';

    }

}