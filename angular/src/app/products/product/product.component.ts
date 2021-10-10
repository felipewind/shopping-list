import { ActivatedRoute } from '@angular/router';
import { Component } from "@angular/core";
import { Header, HeaderType } from "src/app/core/header/header";
import { HeaderService } from "src/app/core/header/header.service";

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.css']
})
export class ProductComponent {

    constructor(
        headerService: HeaderService,
        activatedRoute: ActivatedRoute) {

        const header: Header = {
            headerType: HeaderType.PRODUCT,
            shoppingName: activatedRoute.snapshot.params.shoppingName
        }

        headerService.setHeader(header);


    }

}