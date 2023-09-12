import { Component } from '@angular/core';
import { IndexesDataService } from '../../services/indexes-data.service';
import { indexDailyData } from '../../interfaces/indexDailyData';

@Component({
  selector: 'app-index-displays',
  templateUrl: './index-displays.component.html',
  styleUrls: ['./index-displays.component.css']
})
export class IndexDisplaysComponent {
  indexes: indexDailyData[] = []

  selectedIndex = 0
  displayTicker: string = 'SPY'
  displayIndex: string = 'S&P 500'

  constructor(private indexes_service: IndexesDataService) { }

  ngOnInit(): void {
    this.indexes_service.getIndexesData().subscribe(
      (response: any) => {
        let functionalIndexesData: any
        console.log(response)
        functionalIndexesData = response['daily_info']

        // loop through functionalIndexesData and create an array of indexDailyData objects
        functionalIndexesData = Object.entries(functionalIndexesData).map(([key, value]) => ({key, value}));
        functionalIndexesData.forEach((element: any) => {
          let formatted_percent_change = element.value['days_change'].slice(0, -1)
          formatted_percent_change = parseFloat(formatted_percent_change)
          formatted_percent_change = formatted_percent_change.toFixed(2)
          formatted_percent_change = formatted_percent_change + '%'

          this.indexes.push({
            ticker: element.value['ticker'],
            title: element.value['title'],
            price: element.value['price'],
            percent_change: formatted_percent_change,
            datetime_added: element.value['datetime_added']
          })
        })
      })
   }

  onChangeIndexChart(index: any): void {
    this.displayTicker = this.indexes[index].ticker
    this.displayIndex = this.indexes[index].title
  }
}
