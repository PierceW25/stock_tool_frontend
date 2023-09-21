import { Component, Input, OnInit } from '@angular/core';
import { StockApiService } from 'src/app/services/stock-api.service';
import { EarningsDataPoint } from 'src/app/interfaces/earningsDataPoint';

@Component({
  selector: 'app-earnings-chart',
  templateUrl: './earnings-chart.component.html',
  styleUrls: ['./earnings-chart.component.css']
})
export class EarningsChartComponent implements OnInit {
  constructor(private stockApiService: StockApiService) { }

  @Input() stockSymbol: string = '';
  @Input() fiscalYearEndMonth: string = '';

  ngOnInit(): void {
    this.stockApiService.getStockEarnings(this.stockSymbol).subscribe((data: any) => {
      let fiscalYearEndMonth = new Date(this.fiscalYearEndMonth + ' 1, 2023').getMonth() + 1;
      let querterlyEarnings: EarningsDataPoint[] = data['quarterlyEarnings'];
      let allQuarterEndDates: String[][] = [];
      for (let i = 0; i < querterlyEarnings.length; i++) {
        let date = new Date(querterlyEarnings[i].fiscalDateEnding);
        if (date.getMonth() + 1 === fiscalYearEndMonth) {
          console.log(date)
          console.log('first three after \n')
          console.log(new Date(querterlyEarnings[i+1].fiscalDateEnding))
          console.log(new Date(querterlyEarnings[i+2].fiscalDateEnding))
          console.log(new Date(querterlyEarnings[i+3].fiscalDateEnding))
          console.log('first three before \n')
          console.log(new Date(querterlyEarnings[i-1].fiscalDateEnding))
          console.log(new Date(querterlyEarnings[i-2].fiscalDateEnding))
          console.log(new Date(querterlyEarnings[i-3].fiscalDateEnding))
          break;
        }
    }
    });
  }
}
