import { Injectable } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  private deviceXs: boolean = false;

  private deviceXsSubject = new BehaviorSubject<boolean>(this.deviceXs);

  constructor(public mediaObserver: MediaObserver) {
    this.mediaObserver.asObservable().subscribe((result: MediaChange[]) => {
      this.deviceXs = result[0].mqAlias === 'xs' ? true : false;
      this.deviceXsSubject.next(this.deviceXs);
    })
  }

  getDeviceXs(): Observable<boolean> {
    return this.deviceXsSubject.asObservable();
  }
}
