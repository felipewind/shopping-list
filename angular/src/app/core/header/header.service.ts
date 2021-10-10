import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Header } from './header';

@Injectable({
    providedIn: 'root'
})
export class HeaderService {

    private headerSubject = new Subject<Header>();

    getHeader(): Observable<Header> {
        return this.headerSubject.asObservable();
    }

    setHeader(header: Header): void {
        this.headerSubject.next(header);
    }

}