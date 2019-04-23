import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import { DataService } from './../data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public tables: any;
  public tb: any;
  public tbName = '';
  public fields: any;
  public fld: any;
  public fldName = '';

  constructor(
    public dataService: DataService
  ) { }



  ngOnInit() {
    this.listTable();

  }

  listTable() {
    this.dataService.listTable().then((res: any) => {
      this.tables = res.data;
      // console.log(this.tables)
    });
  }

  listField(e: any) {
    this.dataService.listField(this.tb.table).then((res: any) => {
      this.tbName = this.tb.data;
      this.fields = res.data;
      console.log(this.tb.data);
      // console.log(this.fields);

      this.getData(this.fields);

    });
  }

  getData(f: any) {
    f.forEach(e => {
      console.log(e);
    });
  }

  selectData(e: any) {
    const fld = e.code;
    this.fldName = e.descb;
    this.dataService.selectData(this.tb.table, fld).then((res: any) => {
      let datArr = [];
      const cname = e.descb;
      const dat = res.data;
      datArr = this.numArr(dat, 1);
      const series = [{
        name: cname,
        data: datArr
      }];
      const category = this.txtArr(dat, 0);
      // console.log(series);
      // this.getChart(category, series, cname);
      // this.listYear();
    });
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

}
