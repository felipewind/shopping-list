import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { UnauthorizedInterceptor } from './auth/auth-unauthorized.interceptor';
import { HeaderComponent } from './header/header.component';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { HeaderShoppingComponent } from './header-shopping/header-shopping.component';

@NgModule({
  declarations: [
    HeaderComponent,
    HeaderShoppingComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    HeaderComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: UnauthorizedInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ]
})
export class CoreModule { }
