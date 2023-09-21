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
        if (date.getMonth() + 1 === fiscalYearEndMonth && 
            querterlyEarnings[i+1] && 
            querterlyEarnings[i+2] && 
            querterlyEarnings[i+3]) {
          //conditions for  ending in q3 or q2 or q1
          let fiscalYear = querterlyEarnings[i].fiscalDateEnding.slice(2, 4)

          //Doing hackey stuff to get the quarter end dates to displaye with the correct fiscal year
          //the reverse counter is used to ge the correct quarter end dates for the first 3 quarters of the year
          let reverseCounter = i;
          for (let x = 0; x < i && i < 3; x++) {
            allQuarterEndDates.push([querterlyEarnings[x].fiscalDateEnding, 'Q' + reverseCounter + ' FY' + Number(Number(fiscalYear) + 1)]);
            reverseCounter--;
          }

          allQuarterEndDates.push([querterlyEarnings[i].fiscalDateEnding, 'Q4 FY' + fiscalYear]);
          allQuarterEndDates.push([querterlyEarnings[i+1].fiscalDateEnding, 'Q3 FY' + fiscalYear]);
          allQuarterEndDates.push([querterlyEarnings[i+2].fiscalDateEnding, 'Q2 FY' + fiscalYear]);
          allQuarterEndDates.push([querterlyEarnings[i+3].fiscalDateEnding, 'Q1 FY' + fiscalYear]);
        }

        if (i == 7) {
          break;
        }
      }
      allQuarterEndDates.length = 8;
      console.log(allQuarterEndDates)
    });
  }
}
