import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }

  private display: BehaviorSubject<boolean> = new BehaviorSubject(false)

  watch(): Observable<boolean> {
    return this.display.asObservable()
  }

  open(): void {
    this.display.next(true)
  } 

  close(): void {
    this.display.next(false)
  }
}
