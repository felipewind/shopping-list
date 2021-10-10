import { Injectable } from "@angular/core";
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    constructor(private _snackBar: MatSnackBar) { }

    showMessage(message: string, isError: boolean = false, durationTime: number = 3000): void {

        this._snackBar.open(message, 'X', {
            duration: durationTime,
            horizontalPosition: "center",
            verticalPosition: "bottom",
            panelClass: isError ? ['msg-error'] : ['msg-success']
        });
    }

}