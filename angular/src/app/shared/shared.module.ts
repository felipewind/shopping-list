import { NgModule } from "@angular/core";
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
    imports: [
        FlexLayoutModule,
        MatCardModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        MatTableModule,
        MatCheckboxModule,
        MatSelectModule,
        MatMenuModule
    ],
    exports: [
        FlexLayoutModule,
        MatCardModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatCheckboxModule,
        MatSelectModule,
        MatMenuModule
    ]
})
export class SharedModule { }