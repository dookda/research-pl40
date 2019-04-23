import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import * as L from 'leaflet';
import * as Highcharts from 'highcharts';
import * as HC_regression from 'highcharts-regression';
import * as ss from 'simple-statistics';
HC_regression(Highcharts);

@Component({
  selector: 'app-regression',
  templateUrl: './regression.component.html',
  styleUrls: ['./regression.component.scss']
})
export class RegressionComponent implements OnInit {
  public tables: any;
  public tb: any;
  public tbName = '';
  public fields: any;
  public fld: any;
  public fldName = '';
  public data: any;
  public dat: any;
  public year: any;
  public yr: any;

  public lstCorr_sel: any = [];
  public arrCorr_sel: any = [];
  public datCorr_sel: any = [];
  public notifyCorr: string;
  public correlation: any;

  public stat: any;


  constructor(
    public dataService: DataService
  ) { }

  async ngOnInit() {
    this.listTable();
  }

  listTable() {
    this.dataService.listTable().then((res: any) => {
      this.tables = res.data;
    });
  }

  listField(e: any) {
    this.dataService.listField(this.tb.table).then((res: any) => {
      this.tbName = this.tb.data;
      this.fields = res.data;
    });
  }

  selectData(e: any) {
    this.fldName = e.descb;
    this.listYear();
  }

  listYear() {
    this.dataService.listYear(this.tb.table).then((res: any) => {
      this.year = res.data;
      this.yr = null;
    });
  }

  async selectByYear(yr: any) {
  }

  async addParam() {
    let datArr: DataObj = {};
    if (!this.fld || this.fld.code.length < 1) {
      this.notifyCorr = 'กรุณาเลือกข้อมูลที่ต้องการวิเคราะห์';
    } else if (!this.yr) {
      this.notifyCorr = 'กรุณาเลือกปีของข้อมูลที่ต้องการวิเคราะห์';
    } else {
      this.notifyCorr = '';
      datArr = {
        tb: this.tb.table,
        tbName: this.tb.data,
        code: this.fld.code,
        descb: this.fld.descb,
        id: this.fld.id,
        unit: this.fld.unit,
        year: this.yr.year,
      }
      this.lstCorr_sel.push(datArr);
      await this.dataService.selectDataCorr(this.tb.table, this.fld.code, this.yr.year).then((res: any) => {
        this.datCorr_sel.push(res.data);
        this.createDom();
      });
    }
  }

  async createDom() {
    this.arrCorr_sel = [];
    const n = this.datCorr_sel;
    const m = this.lstCorr_sel;
    let dom: string;
    const nLen = this.datCorr_sel.length;
    for (let i = 0; i < (nLen - 1); i++) {
      for (let j = i; j < nLen; j++) {
        if (n[i] !== n[j]) {
          dom = `scatter${i}-${j}`;
          await this.arrCorr_sel.push({ 'cid': dom });
        }
      }
    }
  }

  async calCorrelation() {
    const n = this.datCorr_sel;
    const m = this.lstCorr_sel;
    let dom: string;
    const nLen = this.datCorr_sel.length;
    for (let i = 0; i < (nLen - 1); i++) {
      for (let j = i; j < nLen; j++) {
        if (n[i] !== n[j]) {
          dom = `scatter${i}-${j}`;
          await this.compareParam(n[i], m[i], n[j], m[j], dom);
        }
      }
    }
  }

  async compareParam(arr1: any, arr1Desc: any, arr2: any, arr2Desc: any, dom: any) {
    const xAxis = `${arr1Desc.descb} ปี${arr1Desc.year}`;
    const yAxis = `${arr2Desc.descb} ปี${arr2Desc.year}`;
    const result = [];
    const arr1Sel = [];
    const arr2Sel = [];
    let series: Series;
    await arr1.forEach((a1: any) => {
      arr2.forEach((a2: any) => {
        if (a1.pro_code === a2.pro_code) {
          result.push([Number(Object.values(a1)[1]), Number(Object.values(a2)[1])]);
          arr1Sel.push(Number(Object.values(a1)[1]));
          arr2Sel.push(Number(Object.values(a2)[1]));
        }
        // a1.pro_code === a2.pro_code ? result.push([Number(Object.values(a1)[1]), Number(Object.values(a2)[1])]) : console.log();
      });
    });
    const arr1N = arr1Sel.length;
    const arr2N = arr2Sel.length;
    const arr1Mean = ss.mean(arr1Sel).toFixed(2);
    const arr2Mean = ss.mean(arr2Sel).toFixed(2);
    const arr1Std = ss.sampleStandardDeviation(arr1Sel).toFixed(2);
    const arr2Std = ss.sampleStandardDeviation(arr2Sel).toFixed(2);
    const arrCorr = ss.sampleCorrelation(arr1Sel, arr2Sel).toFixed(2);

    series = {
      regression: true,
      regressionSettings: {
        type: 'linear',
        color: 'rgba(40, 100, 255, .9)',
        name: '%eq <br/> r<sup>2</sup>: %r2'
      },
      showInLegend: false,
      name: '',
      color: 'rgba(223, 83, 83, .5)',
      data: result
    }
    this.createScatter(series, xAxis, yAxis, dom, arr1Std, arr2Std, arr1Mean, arr2Mean, arr1N, arr2N, arrCorr);
  }

  numArr(dat: any, i: number) {
    const v = [];
    dat.forEach((d: any) => {
      v.push(Number(Object.values(d)[i]));
    });
    return v;
  }

  txtArr(dat: any, i: number) {
    const v = [];
    dat.forEach((d: any) => {
      v.push(String(Object.values(d)[i]));
    });
    return v;
  }

  clearParam() {
    this.listTable();
    this.fields = [];
    this.fld = null;
    this.year = [];
    this.yr = null;
    this.arrCorr_sel = [];
    this.lstCorr_sel = [];
    this.datCorr_sel = [];
  }

  createScatter(series: any, xAxis: any, yAxis: any, id: any, arr1Std: any, arr2Std: any, arr1Mean: any, arr2Mean: any, arr1N: any, arr2N: any, arrCorr: any) {
    Highcharts.setOptions({
      lang: {
        thousandsSep: ','
      },
      chart: {
        style: {
          fontFamily: 'Kanit'
        }
      }
    });

    Highcharts.chart(id, {
      chart: {
        type: 'scatter',
        zoomType: 'xy'
      },
      title: {
        text: '',
        style: {
          display: 'none'
        }
      },
      subtitle: {
        text: xAxis + ' SD.: ' + Highcharts.numberFormat(arr1Std, 0) + ' Mean: ' + Highcharts.numberFormat(arr1Mean, 0) + ' n: ' + arr1N + '<br/>' +
          yAxis + ' SD.: ' + Highcharts.numberFormat(arr2Std, 0) + ' Mean: ' + Highcharts.numberFormat(arr2Mean, 0) + ' n: ' + arr2N + '<br/>' +
          'Correlation (r): ' + arrCorr + '<br/>',
      },
      xAxis: {
        title: {
          text: xAxis
        },
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true
      },
      yAxis: {
        title: {
          text: yAxis
        }
      },
      legend: {
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'top',
        x: 70,
        y: 70,
        floating: true,
        backgroundColor: '#FFFFFF',
        borderWidth: 1
      },
      plotOptions: {
        scatter: {
          marker: {
            radius: 5,
            states: {
              hover: {
                enabled: true,
                lineColor: 'rgb(100,100,100)'
              }
            }
          },
          states: {
            hover: {
              marker: {
                enabled: false
              }
            }
          },
          tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: xAxis + ': {point.x}<br/>' + yAxis + ': {point.y}'
          }
        }
      },
      series: [series]
    });
  }

}

export interface DataObj {
  code?: any;
  id?: number;
  descb?: string;
  unit?: string;
  year?: string;
  tb?: string;
  tbName?: string;
}

export interface Series {
  regression?: any,
  regressionSettings?: any,
  showInLegend?: any,
  name?: string;
  color?: string;
  data?: any;
}

export interface Stat {
  code?: any;
  id?: number;
  descb?: string;
  unit?: string;
  year?: string;
  tb?: string;
  tbName?: string;
  av?: number;
  sd?: number;
}
