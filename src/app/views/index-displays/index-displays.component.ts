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
  initialChartColor: string = 'rgb(0, 0, 0)'
  displayedIndexesPrice: string = '0.00'
  displayedIndexesPercentChange: string = '0.00%'
  displayedIndexesPriceChange: string = '$0.00'

  constructor(private indexes_service: IndexesDataService) { }

  ngOnInit(): void {
    this.indexes_service.getIndexesData().subscribe(
      (response: any) => {
        let functionalIndexesData: any
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
            price: element.value['price'].toFixed(2),
            percent_change: formatted_percent_change,
            datetime_added: element.value['datetime_added']
          })
        })
        this.displayedIndexesPrice = '$' + this.indexes[0].price.toString()
        this.displayedIndexesPercentChange = this.indexes[0].percent_change
        let calculatedPriceChange = this.indexes[0].price * (parseFloat(this.indexes[0].percent_change.slice(0, -1)) / 100)
        this.displayedIndexesPriceChange = calculatedPriceChange.toFixed(2).toString()
      })

   }

  onChangeIndexChart(index: any): void {
    this.displayTicker = this.indexes[index].ticker
    this.displayIndex = this.indexes[index].title
    this.displayedIndexesPrice = '$' + this.indexes[index].price.toString()
    this.displayedIndexesPercentChange = this.indexes[index].percent_change
    let calculatedPriceChange = this.indexes[index].price * (parseFloat(this.indexes[index].percent_change.slice(0, -1)) / 100)
    this.displayedIndexesPriceChange = calculatedPriceChange.toFixed(2).toString()
    console.log('index page output')
    console.log(this.displayedIndexesPercentChange)
    console.log(this.displayedIndexesPriceChange)
  }
}
