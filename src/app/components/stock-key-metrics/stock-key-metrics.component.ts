import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { formatLargeNumber } from 'src/app/utils/valueManipulation';

@Component({
  selector: 'app-stock-key-metrics',
  templateUrl: './stock-key-metrics.component.html',
  styleUrls: ['./stock-key-metrics.component.css']
})
export class StockKeyMetricsComponent {
  constructor() {}

  @Input() stockName: string = ''
  @Input() fiscalYears: string[] = []
  @Input() allMetrics: any[][] = []
  @Input() profitable: boolean = false
  @Input() growingRevenue: boolean = false

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['allMetrics'].previousValue != undefined && changes['allMetrics']?.currentValue != changes['allMetrics']?.previousValue) {
      this.allMetrics = changes['allMetrics']?.currentValue;
      this.profitable = changes['profitable']?.currentValue;
      this.growingRevenue = changes['growingRevenue']?.currentValue;
    } else {
      this.profitable = changes['profitable']?.currentValue;
      this.growingRevenue = changes['growingRevenue']?.currentValue;
    }
  }
}
