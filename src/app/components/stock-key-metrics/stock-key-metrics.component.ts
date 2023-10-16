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

}
