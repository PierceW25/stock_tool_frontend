import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stock-health-metrics',
  templateUrl: './stock-health-metrics.component.html',
  styleUrls: ['./stock-health-metrics.component.css']
})
export class StockHealthMetricsComponent {
  constructor() { }

  @Input() stockName: string = ''
}
