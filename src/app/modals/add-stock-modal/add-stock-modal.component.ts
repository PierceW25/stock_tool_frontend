import { Component } from '@angular/core';
import { StockApiService } from '../../services/stock-api.service';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-add-stock-modal',
  templateUrl: './add-stock-modal.component.html',
  styleUrls: ['./add-stock-modal.component.css']
})
export class AddStockModalComponent {

  constructor(
    private dialogRef: MatDialogRef<AddStockModalComponent>,
    private stockApi: StockApiService,
    ) { }

  ticker: string = ''
  options: any = []

  editTicker(event: any) {
    
    if (event.target.value) {
      
      this.options = []
      this.options = this.autoComplete(event.target.value)

      // this code is probably incomplete in logic
      if ('No results found' in this.options) {
        return
      } else {
        this.ticker = event.target.value.split(' ')[0]
      }
    }
  }

  addStock() {
    this.dialogRef.close(this.ticker.toUpperCase())
  }

  autoComplete(ticker: string) {
    let privateOptions: any = []
    this.stockApi.searchStock(ticker).subscribe(response => {
      let fullOptionsObj: any = response
      if (fullOptionsObj['bestMatches'] != undefined) {
        fullOptionsObj['bestMatches'].forEach((stock: any) => {
          privateOptions.push(`${stock['1. symbol']} - ${stock['2. name']}`)
        }) 
      } else {
        privateOptions.push('No results found')
      }
    })
    return privateOptions
  }
}

