import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import * as Highcharts from 'highcharts';
import { DataService } from '../data.service';
import * as ss from 'simple-statistics';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public map: any;
  public center: any;
  public zoom: any;

  public grod: any;
  public gter: any;
  public ghyb: any;
  public mbox: any;

  public tam: any;
  public amp: any;
  public pro: any;

  public headers: any;
  public header_ls: any;
  public selectedHeader: any;
  public selectedHeaderProv: any;
  public listField_ls: any;
  public listField: any;

  public provs: any;
  public prov_ls: any;
  public provShow = false;
  public years: any;
  public years_ls: any;
  public header_sel: any;
  public prov_sel: any;
  public data_sel: any;

  public col_code: any;
  public col_desc: any;

  public tb_sel: any;
  public series = [];
  public categories = [];


  // correlation
  public headerCorre: any;
  public listCorr_ls: any;
  public listCorre: any;
  public tbCorr_sel: any;
  public year_sel: any;
  public colCorr_sel: any;
  public lstCorr_sel = [];
  public arrCorr_sel = [];


  constructor(
    public dataService: DataService,

  ) { }

  ngOnInit() {
    this.center = [13.0, 101.1];
    this.zoom = 6;
    this.loadmap();

    this.loadHeader();


  }

  loadmap() {
    this.map = L.map('map', {
      center: this.center,
      zoom: this.zoom
    });

    // base map
    this.mbox = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy;',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoiY3NrZWxseSIsImEiOiJjamV1NTd1eXIwMTh2MzN1bDBhN3AyamxoIn0.Z2euk6_og32zgG6nQrbFLw'
    });

    this.grod = L.tileLayer('http://{s}.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
      maxZoom: 18,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    this.ghyb = L.tileLayer('http://{s}.google.com/vt/lyrs=y,m&x={x}&y={y}&z={z}', {
      maxZoom: 18,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    this.gter = L.tileLayer('http://{s}.google.com/vt/lyrs=t,m&x={x}&y={y}&z={z}', {
      maxZoom: 18,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    // overlay map
    const mapUrl = 'http://map.nu.ac.th/geoserver-hgis/ows?';
    const cgiUrl = 'http://www.cgi.uru.ac.th/geoserver/ows?';
    const w3Url = 'http://www3.cgistln.nu.ac.th/geoserver/gistdata/ows?';

    const rainInterp = L.tileLayer.wms(w3Url, {
      layers: 'gistdata:geotiff_coverage',
      format: 'image/png',
      transparent: true,
      zIndex: 1
    });

    this.pro = L.tileLayer.wms(cgiUrl, {
      layers: 'th:province_4326',
      format: 'image/png',
      transparent: true,
      zIndex: 5,
      // CQL_FILTER: 'prov_code=65'
    });

    this.amp = L.tileLayer.wms(cgiUrl, {
      layers: '	th:amphoe_4326',
      format: 'image/png',
      transparent: true,
      zIndex: 5,
      // CQL_FILTER: 'prov_code=65'
    });

    this.tam = L.tileLayer.wms(cgiUrl, {
      layers: 'th:tambon_4326',
      format: 'image/png',
      transparent: true,
      zIndex: 5,
      // CQL_FILTER: 'prov_code=65'
    });

    const baseLayers = {
      'map box': this.mbox,
      'แผนที่ถนน': this.grod.addTo(this.map),
      'แผนที่ภาพดาวเทียม': this.ghyb,
      'แผนที่ภูมิประเทศ': this.gter,
    };

    const overlayLayers = {
      'ปริมาณน้ำฝน': rainInterp.addTo(this.map),
      'ขอบเขตตำบล': this.tam.addTo(this.map),
      'ขอบเขตอำเภอ': this.amp.addTo(this.map),
      'ขอบเขตจังหวัด': this.pro.addTo(this.map)
    };

    L.control.layers(baseLayers, overlayLayers).addTo(this.map);
    // this.proCheck = true;
    // this.ampCheck = true;
    // this.tamCheck = true;
  }

  // show th data
  async getParameter() {
    let cql_col = '';
    this.col_code = '';
    this.categories = [];
    this.series = [];
    this.col_desc = [];
    this.data_sel.forEach((e: any, i: number) => {
      cql_col += this.createCQL(i, e.code);
      this.col_code += this.createCol(e.code);
      this.col_desc.push(e.descb);
    });
    this.dataService.getSelectedData(this.tb_sel.table, cql_col).then((res: any) => {
      const dat = res.data;
      this.col_desc.forEach((c: any, i: number) => {
        this.series.push({ name: String(c), data: this.createArr(dat, i) });
      });
      this.categories = this.createCat(dat);
      this.getChart(this.categories, this.series);
    });
  }

  // show province data
  async selectedProvince(e: any) {
    this.provShow = true;
    this.prov_sel = e;
    const tb = this.tb_sel.table;
    const pros = this.obj2ArrTxt(this.prov_sel, 0);
    const cols = this.obj2ArrSum(this.data_sel, 1);
    const desc = this.obj2ArrTxt(this.data_sel, 2);
    pros.forEach((p: any) => {
      // console.log(col, cols);
      this.loadDat(tb, desc, cols, p);
    });
  }

  async loadDat(tb: any, descArr: any, colArr: any, pro: any) {
    const series = [];
    let categories = [];

    await this.dataService.getSelectedSubData(tb, colArr, pro).then((res: any) => {
      // api order [0]year, [1]pro_code
      colArr.forEach((c: any, i: number) => {
        series.push({ name: descArr[i], data: this.obj2ArrNum(res.data, i + 2) });
      });
      categories = this.obj2ArrTxt(res.data, 0);
    });
    this.createChart('p' + pro, categories, series);
  }

  // facility function
  loadHeader() {
    this.headers = this.dataService.getDataHeader();
  }

  selectHeader(e: any) {
    this.provShow = false;
    this.selectedHeader = `ค่าเฉลี่ยระดับประเทศ: ${e.data} ${e.desc}`;
    this.selectedHeaderProv = `ค่าเฉลี่ยระดับจังหวัด: ${e.data} ${e.desc}`;
    this.tb_sel = e;
    this.loadSelectedTable(e.table);
  }

  loadSelectedTable(tb: string) {
    this.dataService.getFieldFromSelectedTable(tb).then((res: any) => {
      this.listField = res.data;
    });
  }

  selectedData(e: any) {
    this.data_sel = e;
    this.getParameter();

    this.provShow = false;
    this.initProv();
  }

  loadYear(tb: string) {
    this.year_sel = '';
    this.dataService.getDataYear(tb).then((res: any) => {
      this.years = res.data;
    }, (error: any) => {
      console.log(error);
    });
  }

  initProv() {
    this.dataService.getAllPro().then((res: any) => {
      this.provs = res.data;
    }, (error) => {
      console.log(error);
    });
  }

  obj2ArrNum(dat: any, i: number) {
    const v = [];
    dat.forEach((d: any) => {
      v.push(Number(Object.values(d)[i]));
    });
    return v;
  }

  obj2ArrSum(dat: any, i: number) {
    const v = [];
    dat.forEach((d: any) => {
      v.push('SUM(' + Object.values(d)[i] + ') as ' + Object.values(d)[i]);
    });
    return v;
  }


  obj2ArrTxt(dat: any, i: number) {
    const v = [];
    dat.forEach((d: any) => {
      v.push(Object.values(d)[i]);
    });
    return v;
  }

  obj2ArrMate(dat: any, i: number) {
    const v = [];
    dat.forEach((d: any) => {
      v.push(Object.values(d)[i]);
    });
    return v;
  }

  createArr(dat: any, i: number) {
    const v = [];
    dat.forEach((d: any) => {
      const da = [];
      da.push(Object.values(d).map((x: any) => Number(x)));
      v.push(da[0][i + 1]);
    });
    return v;
  }

  createCat(dat: any) {
    const v = [];
    dat.forEach((d: any) => {
      const da = [];
      da.push(Object.values(d).map((x: any) => x));
      v.push(da[0][0]);
    });
    return v;
  }

  createCQL(i: number, item: any) {
    let a = '';
    a = (i > 0) ? ', ' : '';
    return a + 'SUM(' + item + ') as ' + item;
  }

  createCol(item: any) {
    return item;
  }

  // correlation
  selectHeaderCorre(e: any, corre: string) {
    this.tbCorr_sel = e;
    this.dataService.getFieldFromSelectedTable(e.table).then((res: any) => {
      this.listCorre = res.data;
    });
    this.loadYear(e.table);
  }

  selectDataCorr(e: any) {
    this.colCorr_sel = e;
  }

  selectedYear(e: any) {
    this.year_sel = e;
  }

  async addParam() {
    if (this.colCorr_sel.length < 1) {
      console.log('this.colCorr_sel is emty');
    } else if (this.year_sel === '') {
      console.log('this.year_sel is emty');
    } else {
      this.colCorr_sel.year = this.year_sel.year;
      this.colCorr_sel.tb = this.tbCorr_sel.table;
      console.log(this.colCorr_sel);
      this.lstCorr_sel.push(this.colCorr_sel);
      const col = 'SUM(' + this.colCorr_sel.code + ') as ' + this.colCorr_sel.code;
      await this.dataService.getDataCorr(this.colCorr_sel.tb, col, this.colCorr_sel.year).then((res: any) => {
        const corrCateg = this.obj2ArrNum(res.data, 0);
        const corrSeries = this.obj2ArrNum(res.data, 1);
        this.arrCorr_sel.push(corrSeries);
      });
    }
  }

  calCorrelation() {
    // console.log(this.arrCorr_sel.length);

    const s1 = this.arrCorr_sel[0];
    const s2 = this.arrCorr_sel[1];
    const s3 = [];
    if (this.arrCorr_sel.length > 1) {
      // console.log('s1:' + s1, ' s2: ' + s2);
      const a = [];
      const b = [];

      if (s1.length === s2.length) {
        s1.forEach((s: any, i: number) => {
          a.push([s1[i], s2[i]]);
        });
        console.log(a);
        const da = ss.sampleCorrelation(this.arrCorr_sel[0], this.arrCorr_sel[1]).toFixed(2);
        this.createScatter(a);
      } else {
        console.log('not equal lengths');
      }

    } else {
      console.log('select aonther one');
    }
  }

  clearCorr() {
    this.loadHeader();
    this.listCorre = [];
    this.colCorr_sel = null;
    this.years = [];
    this.year_sel = '';
    this.arrCorr_sel = [];
    this.lstCorr_sel = [];
  }

  // chart
  getChart(categories: any, series: any) {
    Highcharts.setOptions({
      lang: {
        thousandsSep: ','
      }
    });

    Highcharts.chart('chart', {
      chart: {
        type: 'line'
      },
      title: {
        text: 'Monthly Average Temperature',
        style: {
          display: 'none'
        }
      },
      subtitle: {
        text: 'Source: WorldClimate.com',
        style: {
          display: 'none'
        }
      },
      xAxis: {
        categories: categories
      },
      yAxis: {
        title: {
          text: 'x'
        }
      },
      tooltip: {
        formatter: function () {
          return '<b>' + Highcharts.numberFormat(this.y, 0) + '</b> (หน่วย)';
        }
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true,
            formatter: function () {
              return Highcharts.numberFormat(this.y, 2);
            }
          },
          enableMouseTracking: true
        }
      },
      series: series
    });
  }

  createChart(cid: any, categories: any, series: any) {
    Highcharts.setOptions({
      lang: {
        thousandsSep: ','
      }
    });

    Highcharts.chart(cid, {
      chart: {
        type: 'line'
      },
      title: {
        text: 'Monthly Average Temperature',
        style: {
          display: 'none'
        }
      },
      subtitle: {
        text: 'Source: WorldClimate.com',
        style: {
          display: 'none'
        }
      },
      xAxis: {
        categories: categories
      },
      yAxis: {
        title: {
          text: 'x'
        }
      },
      tooltip: {
        formatter: function () {
          return '<b>' + Highcharts.numberFormat(this.y, 0) + '</b> (หน่วย)';
        }
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true,
            formatter: function () {
              return Highcharts.numberFormat(this.y, 2);
            }
          },
          enableMouseTracking: true
        }
      },
      series: series
    });
  }

  createScatter(a: any) {
    Highcharts.chart('scatter', {
      chart: {
        type: 'scatter',
        zoomType: 'xy'
      },
      title: {
        text: 'Height Versus Weight of 507 Individuals by Gender'
      },
      subtitle: {
        text: 'Source: Heinz  2003'
      },
      xAxis: {
        title: {
          text: 'Height (cm)'
        },
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true
      },
      yAxis: {
        title: {
          text: 'Weight (kg)'
        }
      },
      legend: {
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'top',
        x: 100,
        y: 70,
        floating: true,
        // backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
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
            pointFormat: '{point.x} cm, {point.y} kg'
          }
        }
      },
      series: [{
        name: 'Female',
        color: 'rgba(223, 83, 83, .5)',
        data: a
      }]
    });
  }
}


export interface Series {
  name?: string;
  data: number;
}
