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

  ngOnInit(): void {
    this.stockApiService.getStockEarnings(this.stockSymbol).subscribe((data: any) => {
      let date = new Date();
      let earningsYearToPullQuarterRulesFrom = date.getFullYear() - 1;
      let datesOfEarnings: Date[] = [];
      let querterlyEarnings: EarningsDataPoint[] = data['quarterlyEarnings'];
      let allQuarterEndDates: Date[] = [];
      for (let i = 0; i < querterlyEarnings.length; i++) {
        let earningsYear = new Date(querterlyEarnings[i].fiscalDateEnding).getFullYear();
        if (earningsYear === earningsYearToPullQuarterRulesFrom) {
          datesOfEarnings.push(new Date(querterlyEarnings[i].fiscalDateEnding));
        }
      }
      //sort datesOfEarnings
      datesOfEarnings.sort((a, b) => {
        return a.getTime() - b.getTime();
      });
      console.log(datesOfEarnings);
    });
  }
}
