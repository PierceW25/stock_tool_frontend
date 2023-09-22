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

  formattedEarnings: EarningsDataPoint[] = [];

  ngOnInit(): void {
    this.stockApiService.getStockEarnings(this.stockSymbol).subscribe((data: any) => {
      let fiscalYearEndMonth = new Date(this.fiscalYearEndMonth + ' 1, 2023').getMonth() + 1;
      let quarterlyEarnings: EarningsDataPoint[] = data['quarterlyEarnings'];
      let privateFormattedEarnings: EarningsDataPoint[] = [];
      let allQuarterEndDates: String[][] = [];
      
      for (let i = 0; i < quarterlyEarnings.length; i++) {
        
        let date = new Date(quarterlyEarnings[i].fiscalDateEnding);
        let earningsDataPoint: EarningsDataPoint = {
          fiscalDateEnding: quarterlyEarnings[i].fiscalDateEnding,
          fiscalQuarter: '-',
          reportedEPS: quarterlyEarnings[i].reportedEPS,
          estimatedEPS: quarterlyEarnings[i].estimatedEPS,
          surprise: quarterlyEarnings[i].surprise,
          surprisePercentage: quarterlyEarnings[i].surprisePercentage
        };

        if (date.getMonth() + 1 === fiscalYearEndMonth && 
            quarterlyEarnings[i+1] && 
            quarterlyEarnings[i+2] && 
            quarterlyEarnings[i+3]) {
          //conditions for  ending in q3 or q2 or q1
          let fiscalYear = quarterlyEarnings[i].fiscalDateEnding.slice(2, 4)

          //Doing hackey stuff to get the quarter end dates to displaye with the correct fiscal year
          //the reverse counter is used to ge the correct quarter end dates for the first 3 quarters of the year
          let reverseCounter = i;
          for (let x = 0; x < i && i < 3; x++) {
            let oneOfFirstQuarterlyEarnings: EarningsDataPoint = {
              fiscalDateEnding: quarterlyEarnings[x].fiscalDateEnding,
              fiscalQuarter: 'Q' + reverseCounter + ' FY' + Number(Number(fiscalYear) + 1),
              reportedEPS: quarterlyEarnings[x].reportedEPS,
              estimatedEPS: quarterlyEarnings[x].estimatedEPS,
              surprise: quarterlyEarnings[x].surprise,
              surprisePercentage: quarterlyEarnings[x].surprisePercentage
            }
            privateFormattedEarnings.push(oneOfFirstQuarterlyEarnings);
            reverseCounter--;
          }

          //create the earnings data points from the quearterlyEarnings[i] and the next 3 earnings data points
          earningsDataPoint.estimatedEPS = quarterlyEarnings[i].estimatedEPS;

          let thisFYQ4: EarningsDataPoint = {
            fiscalDateEnding: quarterlyEarnings[i].fiscalDateEnding,
            fiscalQuarter: 'Q4 FY' + fiscalYear,
            reportedEPS: quarterlyEarnings[i].reportedEPS,
            estimatedEPS: quarterlyEarnings[i].estimatedEPS,
            surprise: quarterlyEarnings[i].surprise,
            surprisePercentage: quarterlyEarnings[i].surprisePercentage
          }
          privateFormattedEarnings.push(thisFYQ4);

          let thisFYQ3: EarningsDataPoint = {
            fiscalDateEnding: quarterlyEarnings[i+1].fiscalDateEnding,
            fiscalQuarter: 'Q3 FY' + fiscalYear,
            reportedEPS: quarterlyEarnings[i+1].reportedEPS,
            estimatedEPS: quarterlyEarnings[i+1].estimatedEPS,
            surprise: quarterlyEarnings[i+1].surprise,
            surprisePercentage: quarterlyEarnings[i+1].surprisePercentage
          }
          privateFormattedEarnings.push(thisFYQ3);

          let thisFYQ2: EarningsDataPoint = {
            fiscalDateEnding: quarterlyEarnings[i+2].fiscalDateEnding,
            fiscalQuarter: 'Q2 FY' + fiscalYear,
            reportedEPS: quarterlyEarnings[i+2].reportedEPS,
            estimatedEPS: quarterlyEarnings[i+2].estimatedEPS,
            surprise: quarterlyEarnings[i+2].surprise,
            surprisePercentage: quarterlyEarnings[i+2].surprisePercentage
          }
          privateFormattedEarnings.push(thisFYQ2);

          let thisFYQ1: EarningsDataPoint = {
            fiscalDateEnding: quarterlyEarnings[i+3].fiscalDateEnding,
            fiscalQuarter: 'Q1 FY' + fiscalYear,
            reportedEPS: quarterlyEarnings[i+3].reportedEPS,
            estimatedEPS: quarterlyEarnings[i+3].estimatedEPS,
            surprise: quarterlyEarnings[i+3].surprise,
            surprisePercentage: quarterlyEarnings[i+3].surprisePercentage
          }
          privateFormattedEarnings.push(thisFYQ1);


          allQuarterEndDates.push([quarterlyEarnings[i].fiscalDateEnding, 'Q4 FY' + fiscalYear]);
          allQuarterEndDates.push([quarterlyEarnings[i+1].fiscalDateEnding, 'Q3 FY' + fiscalYear]);
          allQuarterEndDates.push([quarterlyEarnings[i+2].fiscalDateEnding, 'Q2 FY' + fiscalYear]);
          allQuarterEndDates.push([quarterlyEarnings[i+3].fiscalDateEnding, 'Q1 FY' + fiscalYear]);
        }

        if (i == 7) {
          privateFormattedEarnings.length = 8;
          console.log(privateFormattedEarnings)
          break;
        }
      }
      allQuarterEndDates.length = 8;
      console.log(allQuarterEndDates)
    });
  }
}
