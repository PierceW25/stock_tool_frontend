import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { formatLargeNumber } from 'src/app/utils/valueManipulation';

@Component({
  selector: 'app-stock-key-metrics',
  templateUrl: './stock-key-metrics.component.html',
  styleUrls: ['./stock-key-metrics.component.css']
})
export class StockKeyMetricsComponent implements OnChanges {
  constructor() {}

  @Input() stockName: string = ''
  @Input() fiscalYears: string[] = []
  @Input() allMetrics: any[][] = []

  keyMetrics: any[][] = []

  ngOnChanges(changes: SimpleChanges) {
    if (changes['stockName'].previousValue != undefined && changes['stockName']?.currentValue != changes['stockName']?.previousValue) {
      this.stockName = changes['stockName']?.currentValue;
    } else {
      this.stockName = changes['stockName']?.currentValue;
    }
  }

  formatFinancialData(data: any): string {
    if (isNaN(Number(data))) {
      return data
    } else {
      let dataAsNum = Number(data)
      return formatLargeNumber(dataAsNum).toString()
    }
  }
}
