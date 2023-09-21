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
      let thirdQuarterEndMonth = fiscalYearEndMonth - 3;
      let secondQuarterEndMonth = fiscalYearEndMonth - 6;
      let firstQuarterEndMonth = fiscalYearEndMonth - 9;
      let querterlyEarnings: EarningsDataPoint[] = data['quarterlyEarnings'];
      let allQuarterEndDates: String[][] = [];
      console.log('all end months ' + fiscalYearEndMonth + ' ' + thirdQuarterEndMonth + ' ' + secondQuarterEndMonth + ' ' + firstQuarterEndMonth)
      console.log('testing ' + new Date(this.fiscalYearEndMonth + ' 1, 2023').getMonth() + 4)
      for (let i = 0; i < querterlyEarnings.length; i++) {
        let date = new Date(querterlyEarnings[i].fiscalDateEnding);
        console.log(date)
      }
      console.log(allQuarterEndDates)
    });
  }
}
