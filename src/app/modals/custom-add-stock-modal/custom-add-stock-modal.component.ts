import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {ModalService} from '../../services/modal.service';

@Component({
  selector: 'app-custom-add-stock-modal',
  templateUrl: './custom-add-stock-modal.component.html',
  styleUrls: ['./custom-add-stock-modal.component.css']
})
export class CustomAddStockModalComponent implements OnInit {
  
    constructor(private modalService: ModalService) { }
    
    display$: Observable<boolean> | undefined

    ngOnInit(): void {
      this.display$ = this.modalService.watch()
    }

    open() {
      this.modalService.open()
    }

    close() {
      this.modalService.close()
    }
}
