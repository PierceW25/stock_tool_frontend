import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { StockApiService } from '../../services/stock-api.service';
import Chart from 'chart.js/auto';
import { IndexesDataService } from 'src/app/services/indexes-data.service';

@Component({
  selector: 'app-stock-chart',
  templateUrl: './stock-chart.component.html',
  styleUrls: ['./stock-chart.component.css']
})
export class StockChartComponent implements OnInit, OnChanges {

  constructor(
    private stockApi: StockApiService,
    private indexes_service: IndexesDataService
  ) { }

  @Input() title: string = '-'
  @Input() ticker: string = '-'
  @Input() chartWidth: string = '700px'
  @Input() showButtons: boolean = true
  @Input() indexChart: boolean = false

  chartStyles: Record<string, string> = {}

  chart: any = []
  chartColor: string = ''

  allIndexData: any

  fiveYearChartData: any
  oneYearChartData: any
  threeMonthChartData: any
  oneMonthChartData: any
  oneWeekChartData: any
  oneDayChartData: any

  displayedData: {dates: string[], prices: string[]} = {dates: [], prices: []}

  displayPrice: string = '-'
  displayPriceChange: string = '-'
  displayPercentChange: string = '-'

  ngOnInit(): void {
    this.chartStyles = {
      'width': this.chartWidth,
    }

    if (this.indexChart) {
      this.indexes_service.getAllIndexData().subscribe(response => {
        this.allIndexData = response
        this.oneDayChartData = this.allIndexData[0]['daily_indexes_data']
        this.oneDayChartData.forEach((element: any) => {
          this.displayedData.dates.push(element.date)
          this.displayedData.prices.push(element.price)
        })
        this.displayedData.dates.reverse()
        this.displayedData.prices.reverse()

        this.decideChartColor()

        this.displayPrice = this.displayedData.prices[this.displayedData.prices.length - 1]

        this.changePriceAction()

        this.chart = new Chart('canvas', {
          type: 'line',
          data: {
            labels: this.displayedData.dates,
            datasets: [
              {
                //hide the label of this dataset
                label: '',
                data: this.displayedData.prices,
                borderColor: this.chartColor,
                borderWidth: 1.8,
                pointRadius: 0,
                hoverBorderColor: '#000000',
                hoverBorderWidth: 1.8,
                hoverBackgroundColor: '#000000'
              },
            ],
          },
          options: {
            plugins: {
              legend: {
                display: false
              },

            },
            scales: {
              y: {
                display: true
              },
              x: {
                display: false
              },
            },
          }
        })

        this.oneWeekChartData = this.allIndexData[0]['week_indexes_data']
        this.oneMonthChartData = this.allIndexData[0]['month_indexes_data']
        this.threeMonthChartData = this.allIndexData[0]['three_month_indexes_data']
        this.oneYearChartData = this.allIndexData[0]['one_year_indexes_data']
        this.fiveYearChartData = this.allIndexData[0]['five_year_indexes_data']

      })
    } else {
      let functionalStockData: any

      this.stockApi.getStockChartData(this.ticker).subscribe(response => {
        let formattedData: any[] = []
        functionalStockData = response
        functionalStockData =  Object.entries(functionalStockData["Time Series (Daily)"]).map(([key, value]) => ({key, value}));
        functionalStockData = functionalStockData.forEach((element: any) => {
          formattedData.push({"date": element.key, "price": element.value["5. adjusted close"]}) 
        })
        functionalStockData = formattedData

        this.fiveYearChartData = this.createArrayForTimePeriod(functionalStockData, '5 years')
        this.oneYearChartData = this.createArrayForTimePeriod(functionalStockData, '1 year')
        this.threeMonthChartData = this.createArrayForTimePeriod(functionalStockData, '3 months')
        this.oneMonthChartData = this.createArrayForTimePeriod(functionalStockData, '1 month')
        this.oneWeekChartData = this.createArrayForTimePeriod(functionalStockData, '1 week')
      })
      this.stockApi.getStockDailyChartData(this.ticker).subscribe(response => {
        let formattedData: any[] = []
        let tempStockChartData: any

        tempStockChartData = response
        tempStockChartData = Object.entries(tempStockChartData["Time Series (5min)"]).map(([key, value]) => ({key, value}));
        tempStockChartData.forEach((element: any) => {
          if (element.key.split(' ')[0] === tempStockChartData[0].key.split(' ')[0]) {
            formattedData.push({"date": this.formatTime(element.key.split(' ')[1]), "price": element.value["4. close"]})
          }
        })
        
        this.oneDayChartData = formattedData
        this.oneDayChartData.forEach((element: any) => {
          this.displayedData.dates.push(element.date)
          this.displayedData.prices.push(element.price)
        })

        console.log(this.displayedData)

        this.decideChartColor()

        this.displayPrice = this.displayedData.prices[this.displayedData.prices.length - 1]

        this.changePriceAction()

        this.chart = new Chart('canvas', {
          type: 'line',
          data: {
            labels: this.displayedData.dates.reverse(),
            datasets: [
              {
                //hide the label of this dataset
                label: '',
                data: this.displayedData.prices.reverse(),
                borderColor: this.chartColor,
                borderWidth: 3,
                pointRadius: 0,
                pointHoverRadius: 3
              },
            ],
          },
          options: {
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
              display: false
              },
              x: {
              display: false
              },
            },
          }
        })
        
      })
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ticker'].currentValue != changes['ticker'].previousValue && this.allIndexData) {

      let newIndexData = this.allIndexData.find((element: any) => element.ticker === this.ticker)
      this.oneDayChartData = newIndexData['daily_indexes_data']
      this.oneDayChartData.forEach((element: any) => {
        this.displayedData.dates.push(element.date)
        this.displayedData.prices.push(element.price)
      })
      this.updateChartData(this.oneDayChartData)
      this.displayPrice = this.displayedData.prices[this.displayedData.prices.length - 1]

      this.fiveYearChartData = newIndexData['five_year_indexes_data']
      this.oneYearChartData = newIndexData['one_year_indexes_data']
      this.threeMonthChartData = newIndexData['three_month_indexes_data']
      this.oneMonthChartData = newIndexData['month_indexes_data']
      this.oneWeekChartData = newIndexData['week_indexes_data']
      
    }

    if (changes['ticker'].currentValue != changes['ticker'].previousValue && !this.indexChart) {
      let functionalStockData: any

      this.stockApi.getStockDailyChartData(this.ticker).subscribe(response => {
        let formattedData: any[] = []
        let tempStockChartData: any

        tempStockChartData = response
        tempStockChartData = Object.entries(tempStockChartData["Time Series (5min)"]).map(([key, value]) => ({key, value}));
        tempStockChartData.forEach((element: any) => {
          if (element.key.split(' ')[0] === tempStockChartData[0].key.split(' ')[0]) {
            formattedData.push({"date": this.formatTime(element.key.split(' ')[1]), "price": element.value["4. close"]})
          }
        })
        
        this.oneDayChartData = formattedData
        this.oneDayChartData.forEach((element: any) => {
          this.displayedData.dates.push(element.date)
          this.displayedData.prices.push(element.price)
        })
        this.displayPrice = this.displayedData.prices[this.displayedData.prices.length - 1]
        this.updateChartData(this.oneDayChartData)
      })

      this.stockApi.getStockChartData(this.ticker).subscribe(response => {
        let formattedData: any[] = []
        functionalStockData = response
        functionalStockData =  Object.entries(functionalStockData["Time Series (Daily)"]).map(([key, value]) => ({key, value}));
        functionalStockData = functionalStockData.forEach((element: any) => {
          formattedData.push({"date": element.key, "price": element.value["5. adjusted close"]}) 
        })
        functionalStockData = formattedData

        this.fiveYearChartData = this.createArrayForTimePeriod(functionalStockData, '5 years')
        this.oneYearChartData = this.createArrayForTimePeriod(functionalStockData, '1 year')
        this.threeMonthChartData = this.createArrayForTimePeriod(functionalStockData, '3 months')
        this.oneMonthChartData = this.createArrayForTimePeriod(functionalStockData, '1 month')
        this.oneWeekChartData = this.createArrayForTimePeriod(functionalStockData, '1 week')
      })
  }
  }

  createArrayForTimePeriod(stockData: any, timePeriod: string) {
    let copyOfStockData = stockData.slice()
    let targetDate: any
    let loopCount = 0

    switch (timePeriod) {
      case '5 years':
        if (copyOfStockData.length > 1250) {
          const year = new Date().getFullYear() - 5
          const month = String(new Date().getMonth() + 1).padStart(2, '0')
          const day = String(new Date().getDate()).padStart(2, '0')
          targetDate = `${year}-${month}-${day}`
        } else {
          return copyOfStockData
        }
        break
      case '1 year':
        if (copyOfStockData.length > 250) {
          const year = new Date().getFullYear() - 1
          const month = String(new Date().getMonth() + 1).padStart(2, '0')
          const day = String(new Date().getDate()).padStart(2, '0')
          targetDate = `${year}-${month}-${day}`
        } else {
          return copyOfStockData
        }
        break
      case '3 months':
        if (copyOfStockData.length > 60) {
          targetDate = new Date()
          targetDate.setDate(targetDate.getDate() - 90)
          targetDate = targetDate.toISOString().split('T')[0]
        } else {
          return copyOfStockData
        }
        break
      case '1 month':
        if (copyOfStockData.length > 20) {
          targetDate = new Date()
          targetDate.setDate(targetDate.getDate() - 30)
          targetDate = targetDate.toISOString().split('T')[0]
        } else {
          return copyOfStockData
        }
        break
      case '1 week':
        if (copyOfStockData.length > 5) {
          targetDate = new Date()
          targetDate.setDate(targetDate.getDate() - 7)
          targetDate = targetDate.toISOString().split('T')[0]
        } else {
          return copyOfStockData
        }
        break
      default:
        break
  }

    if (copyOfStockData.findIndex((element: any) => element.date === targetDate) != -1) {
      return copyOfStockData.slice(0, copyOfStockData.findIndex((element: any) => element.date === targetDate) + 1)
    } else {
      while (loopCount < 5) {
        loopCount++
        let modifiedDate = new Date(targetDate)
         modifiedDate.setDate(modifiedDate.getDate() - 1)
         targetDate = modifiedDate.toISOString().split('T')[0]
         if (copyOfStockData.findIndex((element: any) => element.date === targetDate) != -1) {
          return copyOfStockData.slice(0, copyOfStockData.findIndex((element: any) => element.date === targetDate) + 1)
        }
      }
    }

    console.log('big problem with createArrayForTimePeriod function in stock-chart component')
  }

  updateChartData(newData: {date: string, price: string}[]): void {
    this.displayedData = {dates: [], prices: []}
    newData.forEach((element:any) => {
      this.displayedData.dates.push(element.date)
      this.displayedData.prices.push(element.price)
    })
    this.chart.data.labels = this.displayedData.dates.reverse()
    this.chart.data.datasets[0].data = this.displayedData.prices.reverse()
    this.decideChartColor()
    this.changePriceAction()
    this.chart.data.datasets[0].borderColor = this.chartColor
    this.chart.update()    
  }

  formatTime(time: string): string {
    const [hours, minutes] = time.split(':')
    const date = new Date
    date.setHours(Number(hours))
    date.setMinutes(Number(minutes))

    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  }

  changeTime(time: string) {
    switch (time) {
      case '5 years':
        this.updateChartData(this.fiveYearChartData)
        break
      case '1 year':
        this.updateChartData(this.oneYearChartData)
        break
      case '3 months':
        this.updateChartData(this.threeMonthChartData)
        break
      case '1 month':
        this.updateChartData(this.oneMonthChartData)
        break
      case '1 week':
        this.updateChartData(this.oneWeekChartData)
        break
      case '1 day':
        this.updateChartData(this.oneDayChartData)
        break
    }

  }

  decideChartColor() {
    if (this.displayedData.prices[0] > this.displayedData.prices[this.displayedData.prices.length - 1]) {
      this.chartColor = '#ff0000'
    } else {
      this.chartColor = '#00ff00'
    }
  }

  changePriceAction() {
    let originalPriceChange = (parseFloat(this.displayedData.prices[this.displayedData.prices.length - 1]) - parseFloat(this.displayedData.prices[0])).toFixed(2)
    this.displayPriceChange = originalPriceChange
    let originalPercentChange = ((parseFloat(this.displayedData.prices[this.displayedData.prices.length - 1]) - parseFloat(this.displayedData.prices[0])) / parseFloat(this.displayedData.prices[0]) * 100).toFixed(2)
    this.displayPercentChange = originalPercentChange
  }

}
