import { Component, OnInit, Output } from '@angular/core';
import {Observable} from 'rxjs';
import {ModalService} from '../../services/modal.service';
import { StockApiService } from '../../services/stock-api.service';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-custom-add-stock-modal',
  templateUrl: './custom-add-stock-modal.component.html',
  styleUrls: ['./custom-add-stock-modal.component.css']
})
export class CustomAddStockModalComponent implements OnInit {
  
    constructor(private modalService: ModalService, private stockApi: StockApiService) { }
    
    display$: Observable<boolean> | undefined
    autofillOptions: string[] = []
    searchStock: string = ''
    errorText: boolean = false
    @Output() onStockPicked: EventEmitter<any> = new EventEmitter()

    ngOnInit(): void {
      this.display$ = this.modalService.watch()
    }

    open() {
      this.modalService.open()
    }

    close() {
      this.modalService.close()
    }

    onEditStockInput(event: any) {
      let searchValue = event.target.value

      let privateOptions: any = []
      this.stockApi.searchStock(searchValue).subscribe(response => {
        let fullOptionsObj: any = response
        if (fullOptionsObj['bestMatches'] != undefined) {
          fullOptionsObj['bestMatches'].forEach((stock: any) => {
            if (!stock['1. symbol'].includes('.')) {
              privateOptions.push(`${stock['1. symbol']} - ${stock['2. name']}`)
            }
          }) 
        } else {
          privateOptions.push('No results found')
        }
      })

      this.autofillOptions = privateOptions
    }

    addStock() {
      if (this.searchStock.includes('-')) {
        this.searchStock = this.searchStock.split('-')[0].trim().toUpperCase()
      } else {
        this.searchStock = this.searchStock.trim().toUpperCase()
      }

      this.stockApi.getStockDailyInfo(this.searchStock).subscribe(response => {
        let stockInfo: any = response
        if (stockInfo['Global Quote']['01. symbol'] == undefined) {
          this.errorText = true
        } else {
          this.onStockPicked.emit(stockInfo['Global Quote']['01. symbol'])
          this.modalService.close()
        }

        this.searchStock = ''
      })
    }
}