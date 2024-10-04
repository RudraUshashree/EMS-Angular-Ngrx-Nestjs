import { Component, Input, ViewChild } from "@angular/core";
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexLegend,
  ApexTooltip,
  ApexNonAxisChartSeries,
  ApexResponsive,
  NgApexchartsModule,
} from "ng-apexcharts";
import { DemoMaterialModule } from "src/app/demo-material-module";
import { IAssociatedData } from "src/app/models/leaves.model";

export interface VisitorChartOptions {
  series: ApexNonAxisChartSeries | any;
  chart: ApexChart | any;
  responsive: ApexResponsive[] | any;
  labels: any;
  tooltip: ApexTooltip | any;
  legend: ApexLegend | any;
  colors: string[] | any;
  stroke: any;
  dataLabels: ApexDataLabels | any;
  plotOptions: ApexPlotOptions | any;
}

@Component({
  selector: "app-employee-leaves-status-chart",
  standalone: true,
  imports: [NgApexchartsModule, DemoMaterialModule],
  templateUrl: "./employee-leaves-status-chart.component.html"
})
export class EmployeeLeavesStatusChartComponent {

  @ViewChild("visitor-chart") chart2: ChartComponent = Object.create(null);
  @Input() leaveStatus: IAssociatedData = {};

  public VisitorChartOptions!: Partial<VisitorChartOptions>;

  constructor() { }

  ngOnInit(): void {
    this.VisitorChartOptions = {
      series: this.leaveStatus.values,
      chart: {
        type: "donut",
        fontFamily: "Poppins,sans-serif",
        height: 253,
      },
      plotOptions: {
        pie: {
          donut: {
            size: "80px",
          },
        },
      },
      tooltip: {
        fillSeriesColor: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 0,
      },
      legend: {
        show: false,
      },
      labels: this.leaveStatus.keys,
      colors: ["#FFDE21", "#26c6da", "#f94449"],
      responsive: [
        {
          breakpoint: 767,
          options: {
            chart: {
              width: 200,
            },
          },
        },
      ],
    };
  }
}
