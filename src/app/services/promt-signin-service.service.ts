import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromtSigninServiceService {

  constructor() { }

  private promptSignin: BehaviorSubject<boolean> = new BehaviorSubject(false)

  watch(): Observable<boolean> {
    return this.promptSignin.asObservable()
  }

  open() {
    this.promptSignin.next(true)
    console.log("ran")
  }

  close() {
    this.promptSignin.next(false)
  }
}
