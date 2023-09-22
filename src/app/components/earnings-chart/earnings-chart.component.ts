import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { StockApiService } from 'src/app/services/stock-api.service';
import { EarningsDataPoint } from 'src/app/interfaces/earningsDataPoint';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-earnings-chart',
  templateUrl: './earnings-chart.component.html',
  styleUrls: ['./earnings-chart.component.css']
})
export class EarningsChartComponent {
  constructor(private stockApiService: StockApiService) { }

  @Input() stockSymbol: string = '';
  @Input() backgroundColor: string = '';

  formattedEarnings?: EarningsDataPoint[];
  chart: any = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stockSymbol'].currentValue != changes['stockSymbol'].previousValue) {
      this.stockSymbol = changes['stockSymbol']?.currentValue;

      this.stockApiService.getStockOverview(this.stockSymbol).subscribe((data: any) => {
        let endMonth = data['FiscalYearEnd']

        this.stockApiService.getStockEarnings(this.stockSymbol).subscribe((data: any) => {
          let fiscalYearEndMonth = new Date(endMonth + ' 1, 2023').getMonth() + 1;
          let quarterlyEarnings: EarningsDataPoint[] = data['quarterlyEarnings'];
  
          this.formattedEarnings = this.createEarningsList(quarterlyEarnings, fiscalYearEndMonth);
          this.createChart(this.formattedEarnings)
        });
      });
    }
  }

  createEarningsList(quarterlyEarnings: EarningsDataPoint[], FYEndMonth: number): EarningsDataPoint[] {
    let privateFormattedEarnings: EarningsDataPoint[] = [];
    
    for (let i = 0; i < quarterlyEarnings.length; i++) {
      
      let date = new Date(quarterlyEarnings[i].fiscalDateEnding);

      if (date.getMonth() + 1 === FYEndMonth && 
                      quarterlyEarnings[i+1] && 
                      quarterlyEarnings[i+2] && 
                      quarterlyEarnings[i+3]) {
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
      }

      if (i == 7) {
        privateFormattedEarnings.length = 8;
        break;
      }
    }
    return privateFormattedEarnings;
  }

  createChart(data: EarningsDataPoint[]) {
    let estimatedEPS: {x: string, y: Number}[] = [];
    let reportedEPS: {x: string, y: Number}[] = [];

    for (let i = data.length - 1; i > -1; i--) {
      reportedEPS.push({x: data[i].fiscalQuarter, y: Number(data[i].reportedEPS)});
      estimatedEPS.push({x: data[i].fiscalQuarter, y: Number(data[i].estimatedEPS)});
    }

    let formattedChartData = {
      datasets: [{
        label: '',
        data: estimatedEPS,
        pointRadius: 7,
        backgroundColor: 'rgba(255, 127, 80, 0.5)'
      },
      {
        label: '',
        data: reportedEPS,
        pointRadius: 7,
        backgroundColor: 'rgba(255, 127, 80, 0.9)'
      }]


    }

    this.chart = new Chart('earnings', {
      type: 'scatter',
      data: formattedChartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'category',
            position: 'bottom',
            ticks: {
              maxRotation: 0,
              minRotation: 0
            }
          },
        },
        plugins: {
          legend: {
            display: false
          }
        },
      }
    })
  }
}
