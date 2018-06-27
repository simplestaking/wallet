import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ChartService} from "../service/chart/chart.service";
import {Chart} from 'chart.js';
import {formatNumber} from "@angular/common";

@Component({
  selector: 'app-day-chart',
  templateUrl: './day-chart.component.html',
  styleUrls: ['./day-chart.component.scss'],
  providers: [ChartService]
})
export class DayChartComponent implements OnInit, AfterViewInit {
    @ViewChild('canvas') public canvas: ElementRef;
    public chart: any = [];
    public price: any = {'min': 0, 'max': 0};
    private ctx: CanvasRenderingContext2D;

    constructor(private _chartService: ChartService, private elRef: ElementRef) { }

    ngOnInit() {}

    ngAfterViewInit() {
        this.getChart()
    }

    getChart() {
        this._chartService.getDay().subscribe(stocks => {
            const xdata = [], ydata = []

            for(const key of Object.keys(stocks)) {
                if(stocks[key].average > 0) {
                    xdata.push(stocks[key].minute)
                    ydata.push(stocks[key].average)
                    // ydata.push(formatNumber(stocks[key].average,'en','0.4-4'));


                    if (this.price['min'] > stocks[key].average || !this.price['min']) {
                        this.price['min'] = stocks[key].average;
                    }
                    if (this.price['max'] < stocks[key].average) { this.price['max'] = stocks[key].average; }
                }
            }

            this.showChart(xdata, ydata)
        })
    }

    showChart(xdata, ydata) {
        const canvas = <HTMLCanvasElement> this.canvas.nativeElement;
        this.ctx = canvas.getContext('2d');

        this.chart = new Chart(this.ctx, {
            type: 'line',
            data: {
                labels: xdata,
                datasets: [{
                    cubicInterpolationMode: 'default',
                    label: 'Cena (ꜩ)',
                    backgroundColor: '#B0E2FF',
                    borderColor: '#1E90FF',
                    borderWidth: 5,
                    pointBackgroundColor: '#1E90FF',
                    pointBorderColor: '#1E90FF',
                    pointHoverBackgroundColor: '#1E90FF',
                    pointHoverBorderColor: '#1E90FF',
                    pointRadius: 0,
                    pointBorderWidth: 0,
                    fill: true,
                    data: ydata,
                }]
            },
            options: {
                elements: {
                    line: {
                        tension: 0.000001
                    },
                    point: {
                        pointStyle: 'circle',
                        radius: 0,
                        hitRadius: 0,
                        hoverRadius: 0,
                        borderWidth: 0,
                    }
                },
                legend: {
                    display: false,
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        title: function(tooltipItems, data) {

                            //Return value for title
                            return 'Date: ' + tooltipItems[0].xLabel;
                        },
                        label: function(tooltipItem, data) {
                            let label = data.datasets[tooltipItem.datasetIndex].label || ''

                            if (label) {
                                label += ': '
                            }
                            label += tooltipItem.yLabel

                            return label;
                        }
                    }
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                layout: {
                    padding: {
                        left: 20,
                        right: 20,
                        top: 20,
                        bottom: 20
                    }
                },
                scales: {
                    xAxes: [{
                        display: true,
                        time: {
                            unit: 'minute'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Last 24 hours'
                        },
                        gridLines: {
                            display: true,
                        },
                        ticks: {
                            display: true,
                            fontSize: 10,
                            padding: 15,
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Market Cap',
                        },
                        ticks: {
                            display: true,
                            fontSize: 10,
                            padding: 15,
                            min: (this.price['min'] - 0.2 > 0) ? (this.price['min'] - 0.2) : 0,
                            max: (this.price['max'] + 0.2),
                            callback: function(value, index, values) {
                                return formatNumber(value,'en','0.1-1') + " ꜩ";
                            }
                        }
                    }]
                }
            }
        });
    }

}
