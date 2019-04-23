import { async } from '@angular/core/testing';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import * as L from 'leaflet';
import * as Highcharts from 'highcharts';

import * as ss from 'simple-statistics';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public tables: any;
  public tb: any;
  public tbName = '';
  public fields: any;
  public fld: any;
  public fldName = '';
  public data: any;
  public dat: any;
  public year1: any;
  public yr1: any;

  public year2: any;
  public yr2: any;

  public grod: any;
  public ghyb: any;
  public gter: any;
  public pro: any;

  public map1: any;
  public map2: any;
  public mapOtp: any;

  public datArr = [];
  public ttest: any;
  public yearArr = [];
  public meanArr = [];

  public pShow = false;

  constructor(
    public dataService: DataService
  ) { }

  async ngOnInit() {
    this.listTable();
    this.mapOtp = {
      center: [13.0, 101.1],
      zoom: 5
    };
    this.loadMap1();
    this.loadMap2();
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

  listYear() {
    this.dataService.listYear(this.tb.table).then((res: any) => {
      this.year1 = res.data;
      this.year2 = res.data;
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
      this.getChart(category, series, cname);
      this.listYear();
    });
  }

  selectByYear(yr: any, mapId: any, chartId: any) {
    this.dataService.selectGeomByYear(this.tb.table, this.fld.code, yr.year).then((res: any) => {
      this.loadJsonToMap(res.data[0].geojson, mapId);
    });
    this.dataService.selectDataByYear(this.tb.table, this.fld.code, yr.year).then((res: any) => {
      let datArr = [];
      datArr = this.numArr(res.data, 1);
      const series = [{
        showInLegend: false,
        name: this.fld.descb,
        data: datArr
      }];
      const category = this.txtArr(res.data, 0);
      this.getProChart(category, series, this.fld.descb, chartId);

      // console.log(datArr);
      const mean = ss.mean(datArr);
      this.datArr.push(datArr);
      this.yearArr.push(yr);
      this.meanArr.push(mean);

      console.log(this.datArr);

      const dat = {
        data1: this.datArr[0],
        data2: this.datArr[1]
      }

      if (this.datArr.length > 2) {
        this.datArr.shift();
        this.yearArr.shift();
        this.meanArr.shift();
        // this.ttest = ss.tTestTwoSample(this.datArr[0], this.datArr[1], 0);     
        this.calStat(dat);
      } else if (this.datArr.length === 2) {
        this.calStat(dat);
        // this.ttest = ss.tTestTwoSample(this.datArr[0], this.datArr[1], 0);
      }

      console.log(this.meanArr, this.yearArr);

    });
  }

  calStat(data: any) {
    this.dataService.getStat(data).then((res: any) => {
      console.log(res);
      this.pShow = true;
      this.ttest = res;
      // return res;
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

  async loadJsonToMap(json: any, mapId: any) {
    let geojson: any;
    const info = L.control();

    const getColor = ((d: any) => {
      return d > 1000 ? '#800026' :
        d > 500 ? '#BD0026' :
          d > 200 ? '#E31A1C' :
            d > 100 ? '#FC4E2A' :
              d > 50 ? '#FD8D3C' :
                d > 20 ? '#FEB24C' :
                  d > 10 ? '#FED976' :
                    '#FFEDA0';
    });

    const style = ((feature: any) => {
      return {
        fillColor: getColor(feature.properties.f2),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
      };
    });

    // info
    function highlightFeature(e: any) {
      const layer = e.target;
      layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
      });
      info.update(layer.feature.properties);

      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
      }
    }

    function resetHighlight(e: any) {
      geojson.resetStyle(e.target);
      info.update();
    }

    const onEachFeature = ((feature: any, layer: any) => {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        // click: zoomToFeature
      });
    });


    info.onAdd = function () {
      this._div = L.DomUtil.create('div', 'info');
      this.update();
      return this._div;
    };
    info.update = function (props: any) {
      this._div.innerHTML = (props ?
        `<div style="
          padding: 6px 8px; 
          font: 14px/16px Kanit, Helvetica, sans-serif;
          background: white; 
          background: rgba(255, 255, 255, 0.8); 
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
          border-radius: 5px;">
          <b>${props.f1}</b>
          <br /> ${props.f2} 
        </div>`
        : '');
    };


    // legend
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {
      const div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        labels = [];
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
      return div;
    };


    if (mapId === 'map1') {
      await this.map1.eachLayer((lyr: any) => {
        if (lyr.feature) {
          this.map1.removeLayer(lyr);
        }
      });
      geojson = L.geoJson(json, {
        style: style,
        onEachFeature: onEachFeature
      }).addTo(this.map1);

      info.addTo(this.map1);
      legend.addTo(this.map1);

    } else if (mapId === 'map2') {
      await this.map2.eachLayer((lyr: any) => {
        if (lyr.feature) {
          this.map2.removeLayer(lyr);
        }
      });
      geojson = L.geoJson(json, {
        style: style,
        onEachFeature: onEachFeature
      }).addTo(this.map2);

      info.addTo(this.map2);
      legend.addTo(this.map2);
    }
  }


  loadMap1() {
    this.map1 = L.map('map1', this.mapOtp);
    // basemap
    const grod = L.tileLayer('http://{s}.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
      maxZoom: 18,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    const ghyb = L.tileLayer('http://{s}.google.com/vt/lyrs=y,m&x={x}&y={y}&z={z}', {
      maxZoom: 18,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    const gter = L.tileLayer('http://{s}.google.com/vt/lyrs=t,m&x={x}&y={y}&z={z}', {
      maxZoom: 18,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    // overlay map
    const mapUrl = 'http://map.nu.ac.th/geoserver-hgis/ows?';
    const cgiUrl = 'http://www.cgi.uru.ac.th/geoserver/ows?';
    const w3Url = 'http://www3.cgistln.nu.ac.th/geoserver/gistdata/ows?';

    const pro = L.tileLayer.wms(cgiUrl, {
      layers: 'th:province_4326',
      format: 'image/png',
      transparent: true,
      zIndex: 5,
      // CQL_FILTER: 'prov_code=65'
    });

    const basemap = {
      'grod': grod,
      'ghyb': ghyb,
      'gter': gter.addTo(this.map1),
    };

    const overlay = {
      'pro': pro.addTo(this.map1)
    };

    L.control.layers(basemap, overlay, { position: 'topleft' }).addTo(this.map1);
  }

  loadMap2() {
    this.map2 = L.map('map2', this.mapOtp);
    // basemap
    const grod = L.tileLayer('http://{s}.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
      maxZoom: 18,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    const ghyb = L.tileLayer('http://{s}.google.com/vt/lyrs=y,m&x={x}&y={y}&z={z}', {
      maxZoom: 18,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    const gter = L.tileLayer('http://{s}.google.com/vt/lyrs=t,m&x={x}&y={y}&z={z}', {
      maxZoom: 18,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    // overlay map
    const mapUrl = 'http://map.nu.ac.th/geoserver-hgis/ows?';
    const cgiUrl = 'http://www.cgi.uru.ac.th/geoserver/ows?';
    const w3Url = 'http://www3.cgistln.nu.ac.th/geoserver/gistdata/ows?';

    const pro = L.tileLayer.wms(cgiUrl, {
      layers: 'th:province_4326',
      format: 'image/png',
      transparent: true,
      zIndex: 5,
      // CQL_FILTER: 'prov_code=65'
    });

    const basemap = {
      'grod': grod,
      'ghyb': ghyb,
      'gter': gter.addTo(this.map2),
    };

    const overlay = {
      'pro': pro.addTo(this.map2)
    };

    L.control.layers(basemap, overlay, { position: 'topleft' }).addTo(this.map2);
  }

  getChart(categories: any, series: any, name: string) {
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

    Highcharts.chart('chart', {
      chart: {
        type: 'line'
      },
      title: {
        text: 'xx',
        style: {
          display: 'none'
        }
      },
      subtitle: {
        text: 'x',
        style: {
          display: 'none'
        }
      },
      xAxis: {
        categories: categories
      },
      yAxis: {
        title: {
          text: name
        }
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true
          },
          enableMouseTracking: true
        }
      },
      series: series
    });
  }

  getProChart(categories: any, series: any, name: string, chartId) {
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

    Highcharts.chart(chartId, {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'xx',
        style: {
          display: 'none'
        }
      },
      subtitle: {
        text: 'xx',
        style: {
          display: 'none'
        }
      },
      xAxis: {
        categories: categories,
        title: {
          text: null
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'unit',
          align: 'high'
        },
        labels: {
          overflow: 'justify'
        }
      },
      tooltip: {
        valueSuffix: ' หน่วย'
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        }
      },

      credits: {
        enabled: false
      },
      series: series
    });
  }


}
