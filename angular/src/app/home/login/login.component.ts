import { HeaderService } from './../../core/header/header.service';
import { Component, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/core/auth/auth.service";
import { PlatformDetectorService } from "src/app/core/platform-detector/plataform-detector.service";
import { Header, HeaderType } from 'src/app/core/header/header';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {

    loginForm: FormGroup;

    @ViewChild('userNameInput') userNameInput!: ElementRef<HTMLInputElement>;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private platformDetectorService: PlatformDetectorService,
        headerService: HeaderService) {

        this.loginForm = this.formBuilder.group({
            userName: ['', [Validators.required, Validators.minLength(3)]],
            password: ['', [Validators.required, Validators.minLength(3)]]
        });

        const header: Header = {
            headerType: HeaderType.LOGIN
        }

        headerService.setHeader(header);

    }

    login(): void {
        const userName: string = this.loginForm.get('userName')?.value.toLowerCase().trim();
        const password: string = this.loginForm.get('password')?.value.toLowerCase();

        this.authService
            .authenticate(userName, password)
            .subscribe(
                () => {
                    this.router.navigate(['users', userName, 'shoppings']);
                },
                (error) => {
                    this.loginForm.reset();
                    alert('Wrong user or password');
                    if (this.platformDetectorService.isPlatformBrowser()) {
                        this.userNameInput.nativeElement.focus();
                    }
                }
            );
    }

    getErrorMessage(field: string): string {
        if (this.loginForm.get(field)?.hasError('required')) {
            return 'Required field';
        }

        if (this.loginForm.get(field)?.hasError('minlength')) {
            return `Minimum size: ${this.loginForm.get(field)?.errors?.minlength.requiredLength}`;
        }

        return this.loginForm.get(field)?.invalid ? `Invalid field ${field}` : '';

    }

}