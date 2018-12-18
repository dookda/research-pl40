import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import * as Highcharts from 'highcharts';
import { DataService } from '../data.service';

@Component({
  selector: 'app-pop',
  templateUrl: './pop.component.html',
  styleUrls: ['./pop.component.css']
})
export class PopComponent implements OnInit {
  // select option
  public provs: any;
  public amps: any;
  public tams: any;
  public lyrs: any;

  public prov_ls: any;
  public amp_ls: any;
  public tam_ls: any;

  public type: any;
  public prov_code: any;
  public amp_code: any;
  public tam_code: any;
  public year: any = 2554;

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

  public placeName_prov: any;
  public placeName_amp: any;
  public placeName_tam: any;

  public proCheck: any;
  public ampCheck: any;
  public tamCheck: any;

  constructor(
    public dataService: DataService
  ) { }

  ngOnInit() {
    this.center = [17.0, 100.5];
    this.zoom = 9;
    this.loadmap();
    this.getChart('th', 99, this.year);
    this.initProv();
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
    // const cgiUrl = 'http://103.40.148.133/gs-ud/ows?';

    this.pro = L.tileLayer.wms(mapUrl, {
      layers: 'hgis:dpc9_province_4326',
      format: 'image/png',
      transparent: true,
      zIndex: 5,
      CQL_FILTER: 'prov_code=65'
    });

    this.amp = L.tileLayer.wms(mapUrl, {
      layers: 'hgis:dpc9_amphoe_4326',
      format: 'image/png',
      transparent: true,
      zIndex: 5,
      CQL_FILTER: 'prov_code=65'
    });

    this.tam = L.tileLayer.wms(mapUrl, {
      layers: 'hgis:dpc9_tambon_4326',
      format: 'image/png',
      transparent: true,
      zIndex: 5,
      CQL_FILTER: 'prov_code=65'
    });

    const baseLayers = {
      'map box': this.mbox,
      'แผนที่ถนน': this.grod.addTo(this.map),
      'แผนที่ภาพดาวเทียม': this.ghyb,
      'แผนที่ภูมิประเทศ': this.gter,
    };

    const overlayLayers = {
      'ขอบเขตจังหวัด': this.pro.addTo(this.map),
      'ขอบเขตอำเภอ': this.amp.addTo(this.map),
      'ขอบเขตตำบล': this.tam.addTo(this.map),
    };

    L.control.layers(baseLayers, overlayLayers).addTo(this.map);
    this.proCheck = true;
    this.ampCheck = true;
    this.tamCheck = true;
  }

  initProv() {
    this.dataService.getAllPro().then((res: any) => {
      this.provs = res.data;
      // console.log(res.data);
    }, (error) => {
      console.log(error);
    });
  }

  selectProv(code: any) {
    this.type = 'prov';
    this.prov_code = code.prov_code;
    this.placeName_prov = code.prov_name;
    this.placeName_amp = null;
    this.placeName_tam = null;
    this.tams = null;

    this.getChart(this.type, this.prov_code, this.year);
    this.dataService.getAllAmp(this.prov_code).then((res: any) => {
      this.amps = res.data;
      // console.log(res.data);
    }, (error) => {
      console.log(error);
    });
  }

  selectAmp(code: any) {
    this.type = 'amp';
    this.amp_code = code.amp_code;
    this.placeName_amp = code.amp_name;
    this.placeName_tam = null;

    this.getChart(this.type, this.amp_code, this.year);
    this.dataService.getAllTam(this.amp_code).then((res: any) => {
      this.tams = res.data;
    }, (error) => {
      console.log(error);
    });
  }

  selectTam(code: any) {
    this.type = 'tam';
    this.tam_code = code.tam_code;
    this.placeName_tam = code.tam_name;
    // console.log(code);
    this.getChart(this.type, this.tam_code, this.year);
  }

  selectYear(year: number) {
    this.year = year;
    if (this.placeName_tam) {
      this.getChart('th', 99, this.year);
      this.getChart('prov', this.prov_code, this.year);
      this.getChart('amp', this.amp_code, this.year);
      this.getChart('tam', this.tam_code, this.year);
    } else if (this.placeName_amp) {
      this.getChart('th', 99, this.year);
      this.getChart('prov', this.prov_code, this.year);
      this.getChart('amp', this.amp_code, this.year);
    } else if (this.placeName_prov) {
      this.getChart('th', 99, this.year);
      this.getChart('prov', this.prov_code, this.year);
    } else {
      this.getChart('th', 99, this.year);
    }
  }

  getChart(type: any, code: any, year: any) {
    this.dataService.getPop(type, code, year).then((res: any) => {
      // const data = res['data'].map((r: any) => Number(r));
      // const d = res.data.map(r => Number(r.m0_4));
      const data = res.data;
      const keys = Object.keys(data[0]);
      const val = Object.values(data[0]);

      // console.log(keys, val);
      const m = Object.values(data[0]).slice(1, 22).map((x: number) => Number(x));
      const f = Object.values(data[0]).slice(22, 43).map((x: number) => x * -1);

      const categories = [
        '0-4', '5-9', '10-14', '15-19',
        '20-24', '25-29', '30-34', '35-39', '40-44',
        '45-49', '50-54', '55-59', '60-64', '65-69',
        '70-74', '75-79', '80-84', '85-89', '90-94',
        '95-99', '100 + '
      ];

      Highcharts.chart(type, {
        chart: {
          type: 'bar'
        },
        title: {
          text: null
        },
        subtitle: {
          text: null
        },
        xAxis: [{
          categories: categories,
          reversed: false,
          labels: {
            step: 1
          }
        }, {
          opposite: true,
          reversed: false,
          categories: categories,
          linkedTo: 0,
          labels: {
            step: 1
          }
        }],
        yAxis: {
          title: {
            text: null
          },
          labels: {
            formatter: function () {
              return Math.abs(this.value) + ' คน';
            }
          }
        },
        plotOptions: {
          series: {
            stacking: 'normal'
          }
        },
        tooltip: {
          formatter: function () {
            return '<b>' + this.series.name + ', อายุ ' + this.point.category + '</b><br/>' +
              'ประชากร: ' + Highcharts.numberFormat(Math.abs(this.point.y), 0) + ' คน';
          }
        },
        series: [{
          name: 'ชาย',
          data: m
        }, {
          name: 'หญิง',
          data: f
        }]
      });
    });
  }

}
