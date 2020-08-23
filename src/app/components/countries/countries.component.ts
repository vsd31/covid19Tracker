import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GlobalDataSummary } from 'src/app/models/gloabl-data';
import { DateWiseData } from 'src/app/models/date-wise-data';
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  data:GlobalDataSummary[];
  countries :String[]= [];
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  selectedCountryData: DateWiseData[];
  dateWiseData:any;
  loading = true;
  lineChart : GoogleChartInterface= {
      chartType: 'LineChart'
  }
  constructor(private dataService: DataServiceService) { }

  ngOnInit() {

    merge(
      this.dataService.getDataWiseData().pipe(
        map(result=>{
          this.dateWiseData = result;
        })
      ),
      this.dataService.getGlobalData().pipe(
        map(result=>{
            this.data=result;
            this.data.forEach(cs=>{
            this.countries.push(cs.country);
          })
        }))
    ).subscribe(
      {
        complete: ()=>{
          this.updateValues('India');
          this.loading=false;
        }
      }
    )
    
 
  }

  updateChart() {
    let dataTable = [];
    dataTable.push(['Date','Cases']);
    this.selectedCountryData.forEach(cs=>{
      dataTable.push([cs.date, cs.cases])
    })

    this.lineChart= {
      chartType: 'LineChart',
      dataTable: dataTable,
      //firstRowIsData: true,
      options: { 
          height :500, 
          animation:{
            duration: 1000,
            easing: 'out',
          },
      },
    };
  }

  updateValues(country : string){
    
    this.data.forEach(cs=>{
      if(cs.country == country)
      {
        this.totalActive = cs.active;
        this.totalConfirmed = cs.confirmed;
        this.totalDeaths = cs.deaths;
        this.totalRecovered = cs.recovered;
      }
    })

    this.selectedCountryData = this.dateWiseData[country]
    // console.log(this.selectedCountryData);
    this.updateChart();
    
  }

}
