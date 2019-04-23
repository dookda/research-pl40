import { DataService } from './../data.service';
import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapcal',
  templateUrl: './mapcal.component.html',
  styleUrls: ['./mapcal.component.scss']
})
export class MapcalComponent implements OnInit {
  public tables: any;
  public tb: any;
  public tbName = '';
  public fields: any;
  public fld: any;
  public fldName = '';
  public year: any;
  public yr: any;
  public data: any;
  public dat: any;

  public tables2: any;
  public tb2: any;
  public tbName2 = '';
  public fields2: any;
  public fld2: any;
  public fldName2 = '';
  public year2: any;
  public yr2: any;
  public data2: any;
  public dat2: any;

  public exp: string;
  public exps = [
    {
      exp: '+'
    }, {
      exp: '-'
    }, {
      exp: '*'
    }, {
      exp: '/'
    }
  ];
  public exp_name: any;

  // map
  public map: any;
  public center: any;
  public zoom: any;

  public mapOtp: any;
  public grod: any;
  public gter: any;
  public ghyb: any;
  public mbox: any;

  public tam: any;
  public amp: any;
  public pro: any;


  constructor(
    public dataService: DataService
  ) { }

  ngOnInit() {
    this.loadmap();
    this.listTable();
    this.listTable2();
  }

  listTable() {
    this.dataService.listTable().then((res: any) => {
      this.tables = res.data;
    });
  }

  listField(e: any) {
    this.dataService.listField(e.table).then((res: any) => {
      // this.tbName = this.tb.data;
      this.fields = res.data;
    });
  }

  selectData(e: any) {
    // this.fldName = e.descb;
    this.dataService.listYear(this.tb.table).then((res: any) => {
      this.year = res.data;
      this.yr = null;
    });
  }

  async selectByYear(e: any) {
    console.log(e);
  }

  selectExp(e: any) {
    console.log(e);
    this.exp_name = e.exp;
  }

  listTable2() {
    this.dataService.listTable().then((res: any) => {
      this.tables2 = res.data;
    });
  }

  listField2(e: any) {
    this.dataService.listField(e.table).then((res: any) => {
      // this.tbName2 = e.data;
      this.fields2 = res.data;
    });
  }

  selectData2(e: any) {
    // this.fldName2 = e.descb;
    this.dataService.listYear(this.tb2.table).then((res: any) => {
      this.year2 = res.data;
      this.yr2 = null;
    });
  }

  async selectByYear2(e: any) {
    console.log(e);
  }

  calMap() {
    this.dataService.getMapcal(this.tb.table, this.fld.code, this.yr.year, this.tb2.table, this.fld2.code, this.yr2.year, this.exp_name).then((res: any) => {
      console.log(res.data[0].geojson);
      L.geoJson(res.data[0].geojson).addTo(this.map);
    });

    this.dataService.getMapcalStat(this.tb.table, this.fld.code, this.yr.year, this.tb2.table, this.fld2.code, this.yr2.year, this.exp_name).then((res: any) => {
      console.log(res);
      // L.geoJson(res.data[0].geojson).addTo(this.map);
    });
    // console.log(this.tb.table, this.fld.code, this.yr.year, this.tb2.table, this.fld2.code, this.yr2.year, this.exp_name);

  }

  loadmap() {
    this.map = L.map('map', {
      center: [13.0, 101.1],
      zoom: 5
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

    // this.lyrAqi = L.layerGroup();

    const baseLayers = {
      'map box': this.mbox.addTo(this.map),
      'แผนที่ถนน': this.grod,
      'แผนที่ภาพดาวเทียม': this.ghyb,
      'แผนที่ภูมิประเทศ': this.gter
    };

    const overlayLayers = {
      'ขอบเขตตำบล': this.tam,
      'ขอบเขตอำเภอ': this.amp,
      'ขอบเขตจังหวัด': this.pro.addTo(this.map)
    };

    L.control.layers(baseLayers, overlayLayers).addTo(this.map);
    // this.proCheck = true;
    // this.ampCheck = true;
    // this.tamCheck = true;
    // this.loadVirrs();
    // this.loadModis();
    // this.loadAqi();
  }

}