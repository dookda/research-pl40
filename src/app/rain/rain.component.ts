import { async } from '@angular/core/testing';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import * as L from 'leaflet';
import * as Highcharts from 'highcharts';


@Component({
  selector: 'app-rain',
  templateUrl: './rain.component.html',
  styleUrls: ['./rain.component.scss']
})
export class RainComponent implements OnInit {
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

  public lyrGroup: any;
  public tmdData: any;

  public radio: any;
  public meteo: any;

  public marker: any;

  constructor(
    public dataService: DataService
  ) {

  }

  ngOnInit() {
    this.center = [13.0, 101.1];
    this.zoom = 6;
    this.loadmap();
    // this.getRainTmd();

    this.dataService.getTMD().then(async (res: any) => {
      this.meteo = await res.Stations;
      console.log(this.meteo);
      await this.getRainfall();
    });
  }

  async loadmap() {
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


    this.lyrGroup = L.layerGroup();

    const baseLayers = {
      'map box': this.mbox,
      'แผนที่ถนน': this.grod.addTo(this.map),
      'แผนที่ภาพดาวเทียม': this.ghyb,
      'แผนที่ภูมิประเทศ': this.gter,
    };

    const overlayLayers = {
      'สถานีวัดน้ำฝน': this.lyrGroup.addTo(this.map),
      'ปริมาณน้ำฝน': rainInterp.addTo(this.map),
      'ขอบเขตตำบล': this.tam,
      'ขอบเขตอำเภอ': this.amp,
      'ขอบเขตจังหวัด': this.pro.addTo(this.map)
    };

    L.control.layers(baseLayers, overlayLayers).addTo(this.map);

    // this.getRain();

  }

  numArr(dat: any, i: any) {
    const v = [];
    let a: any;

    dat.forEach((d: any) => {
      // console.log(d.Observe.Rainfall.Value);
      if (i === 'Rainfall') {
        a = d.Observe.Rainfall.Value;
      }

      if (i === 'Rainfall') {
        a = d.Observe.Rainfall.Value;
      } else if (i === 'Temperature') {
        a = d.Observe.Temperature.Value;
      } else if (i === 'StationPressure') {
        a = d.Observe.StationPressure.Value;
      } else if (i === 'MeanSeaLevelPressure') {
        a = d.Observe.MeanSeaLevelPressure.Value;
      } else if (i === 'DewPoint') {
        a = d.Observe.DewPoint.Value;
      } else if (i === 'RelativeHumidity') {
        a = d.Observe.RelativeHumidity.Value;
      } else if (i === 'VaporPressure') {
        a = d.Observe.VaporPressure.Value;
      } else if (i === 'LandVisibility') {
        a = d.Observe.LandVisibility.Value;
      } else if (i === 'WindDirection') {
        a = d.Observe.WindDirection.Value;
      } else if (i === 'WindSpeed') {
        a = d.Observe.WindSpeed.Value;
      }


      v.push(Number(a));
    });
    return v;
  }

  txtArr(dat: any, i: number) {
    const v = [];
    dat.forEach((d: any) => {
      // console.log(d.StationNameTh);
      v.push(String(d.StationNameTh));
    });
    return v;
  }

  async getRainfall() {
    await this.map.eachLayer((lyr: any) => {
      if (lyr.options.iconName === 'da') {
        // console.log(lyr)
        this.marker.remove(lyr);
      }
    });

    const markerOptions: MarkerOptions = {
      radius: 5,
      // fillColor: "#ff7800",
      color: '#000',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.5,
      iconName: 'da'
    };

    const datArr = [];
    await datArr.push(this.numArr(this.meteo, 'Rainfall'));
    const series = [{
      showInLegend: false,
      name: 'this.fld.descb',
      data: datArr[0]
    }];
    const category = this.txtArr(this.meteo, 0);
    this.getProChart(category, series, 'this.fld.descb', 'chart');
    this.meteo.forEach((e: any) => {
      const rainfall = e.Observe.Rainfall.Value;
      if (rainfall < 5) {
        markerOptions.fillColor = '#ff7800';
      } else if (rainfall < 10) {
        markerOptions.fillColor = '#26A69A';
      } else if (rainfall < 20) {
        markerOptions.fillColor = '#33FFBD';
      } else if (rainfall < 50) {
        markerOptions.fillColor = '#75FF33';
      } else if (rainfall < 90) {
        markerOptions.fillColor = '#DBFF33';
      } else {
        markerOptions.fillColor = '#FF7043';
      }
      this.marker = L.circleMarker([Number(e.Latitude.Value), Number(e.Longitude.Value)], markerOptions);
      this.lyrGroup.addLayer(this.marker);
      this.marker.bindPopup('I am a circle.');
    });

  }

  async  getTemperature() {
    await this.map.eachLayer((lyr: any) => {
      if (lyr.options.iconName == 'da') {
        this.marker.remove(lyr);
      }
    });
    const markerOptions: MarkerOptions = {
      radius: 5,
      // fillColor: "#ff7800",
      color: '#000',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.5,
      iconName: 'da'
    };

    const datArr = [];
    await datArr.push(this.numArr(this.meteo, 'Temperature'));
    const series = [{
      showInLegend: false,
      name: 'this.fld.descb',
      data: datArr[0]
    }];
    const category = this.txtArr(this.meteo, 0);
    this.getProChart(category, series, 'this.fld.descb', 'chart');
    this.meteo.forEach((e: any) => {
      const rainfall = e.Observe.Temperature.Value;
      if (rainfall < 20) {
        markerOptions.fillColor = '#ff7800';
      } else if (rainfall < 25) {
        markerOptions.fillColor = '#26A69A';
      } else if (rainfall < 30) {
        markerOptions.fillColor = '#33FFBD';
      } else if (rainfall < 35) {
        markerOptions.fillColor = '#75FF33';
      } else if (rainfall < 40) {
        markerOptions.fillColor = '#DBFF33';
      } else {
        markerOptions.fillColor = '#FF7043';
      }
      this.marker = L.circleMarker([Number(e.Latitude.Value), Number(e.Longitude.Value)], markerOptions);
      this.lyrGroup.addLayer(this.marker);
    });
  }


  async  getStationPressure() {
    await this.map.eachLayer((lyr: any) => {
      if (lyr.options.iconName === 'da') {
        this.marker.remove(lyr);
      }
    })
    const markerOptions: MarkerOptions = {
      radius: 5,
      // fillColor: "#ff7800",
      color: '#000',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.5,
      iconName: 'da'
    };

    const datArr = [];
    await datArr.push(this.numArr(this.meteo, 'StationPressure'));
    const series = [{
      showInLegend: false,
      name: 'this.fld.descb',
      data: datArr[0]
    }];
    const category = this.txtArr(this.meteo, 0);
    this.getProChart(category, series, 'this.fld.descb', 'chart');
    this.meteo.forEach((e: any) => {
      const rainfall = e.Observe.StationPressure.Value;
      if (rainfall < 5) {
        markerOptions.fillColor = '#ff7800';
      } else if (rainfall < 10) {
        markerOptions.fillColor = '#26A69A';
      } else if (rainfall < 30) {
        markerOptions.fillColor = '#33FFBD';
      } else if (rainfall < 50) {
        markerOptions.fillColor = '#75FF33';
      } else if (rainfall < 80) {
        markerOptions.fillColor = '#DBFF33';
      } else {
        markerOptions.fillColor = '#FF7043';
      }
      this.marker = L.circleMarker([Number(e.Latitude.Value), Number(e.Longitude.Value)], markerOptions);
      this.lyrGroup.addLayer(this.marker);
    });
  }

  async  getMeanSeaLevelPressure() {
    await this.map.eachLayer((lyr: any) => {
      if (lyr.options.iconName == 'da') {
        this.marker.remove(lyr);
      }
    })
    const markerOptions: MarkerOptions = {
      radius: 5,
      // fillColor: "#ff7800",
      color: '#000',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.5,
      iconName: 'da'
    };

    const datArr = [];
    await datArr.push(this.numArr(this.meteo, 'MeanSeaLevelPressure'));
    const series = [{
      showInLegend: false,
      name: 'this.fld.descb',
      data: datArr[0]
    }];
    const category = this.txtArr(this.meteo, 0);
    this.getProChart(category, series, 'this.fld.descb', 'chart');
    this.meteo.forEach((e: any) => {
      const rainfall = e.Observe.MeanSeaLevelPressure.Value;
      if (rainfall < 5) {
        markerOptions.fillColor = '#ff7800';
      } else if (rainfall < 10) {
        markerOptions.fillColor = '#26A69A';
      } else if (rainfall < 30) {
        markerOptions.fillColor = '#33FFBD';
      } else if (rainfall < 50) {
        markerOptions.fillColor = '#75FF33';
      } else if (rainfall < 80) {
        markerOptions.fillColor = '#DBFF33';
      } else {
        markerOptions.fillColor = '#FF7043';
      }
      this.marker = L.circleMarker([Number(e.Latitude.Value), Number(e.Longitude.Value)], markerOptions);
      this.lyrGroup.addLayer(this.marker);
    });
  }

  async  getDewPoint() {
    await this.map.eachLayer((lyr: any) => {
      if (lyr.options.iconName == 'da') {
        this.marker.remove(lyr);
      }
    });
    const markerOptions: MarkerOptions = {
      radius: 5,
      // fillColor: "#ff7800",
      color: '#000',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.5,
      iconName: 'da'
    };

    const datArr = [];
    await datArr.push(this.numArr(this.meteo, 'DewPoint'));
    const series = [{
      showInLegend: false,
      name: 'this.fld.descb',
      data: datArr[0]
    }];
    const category = this.txtArr(this.meteo, 0);
    this.getProChart(category, series, 'this.fld.descb', 'chart');
    this.meteo.forEach((e: any) => {
      const rainfall = e.Observe.DewPoint.Value;
      if (rainfall < 5) {
        markerOptions.fillColor = '#ff7800';
      } else if (rainfall < 10) {
        markerOptions.fillColor = '#26A69A';
      } else if (rainfall < 30) {
        markerOptions.fillColor = '#33FFBD';
      } else if (rainfall < 50) {
        markerOptions.fillColor = '#75FF33';
      } else if (rainfall < 80) {
        markerOptions.fillColor = '#DBFF33';
      } else {
        markerOptions.fillColor = '#FF7043';
      }
      this.marker = L.circleMarker([Number(e.Latitude.Value), Number(e.Longitude.Value)], markerOptions);
      this.lyrGroup.addLayer(this.marker);
    });
  }

  async  getRelativeHumidity() {
    await this.map.eachLayer((lyr: any) => {
      if (lyr.options.iconName == 'da') {
        this.marker.remove(lyr);
      }
    });
    const markerOptions: MarkerOptions = {
      radius: 5,
      // fillColor: "#ff7800",
      color: '#000',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.5,
      iconName: 'da'
    };

    const datArr = [];
    await datArr.push(this.numArr(this.meteo, 'RelativeHumidity'));
    const series = [{
      showInLegend: false,
      name: 'this.fld.descb',
      data: datArr[0]
    }];
    const category = this.txtArr(this.meteo, 0);
    this.getProChart(category, series, 'this.fld.descb', 'chart');
    this.meteo.forEach((e: any) => {
      const rainfall = e.Observe.RelativeHumidity.Value;
      if (rainfall < 5) {
        markerOptions.fillColor = '#ff7800';
      } else if (rainfall < 10) {
        markerOptions.fillColor = '#26A69A';
      } else if (rainfall < 30) {
        markerOptions.fillColor = '#33FFBD';
      } else if (rainfall < 50) {
        markerOptions.fillColor = '#75FF33';
      } else if (rainfall < 80) {
        markerOptions.fillColor = '#DBFF33';
      } else {
        markerOptions.fillColor = '#FF7043';
      }
      this.marker = L.circleMarker([Number(e.Latitude.Value), Number(e.Longitude.Value)], markerOptions);
      this.lyrGroup.addLayer(this.marker);
    });
  }

  async  getVaporPressure() {
    await this.map.eachLayer((lyr: any) => {
      if (lyr.options.iconName == 'da') {
        this.marker.remove(lyr);
      }
    });
    const markerOptions: MarkerOptions = {
      radius: 5,
      // fillColor: "#ff7800",
      color: '#000',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.5,
      iconName: 'da'
    };

    const datArr = [];
    await datArr.push(this.numArr(this.meteo, 'VaporPressure'));
    const series = [{
      showInLegend: false,
      name: 'this.fld.descb',
      data: datArr[0]
    }];
    const category = this.txtArr(this.meteo, 0);
    this.getProChart(category, series, 'this.fld.descb', 'chart');
    this.meteo.forEach((e: any) => {
      const rainfall = e.Observe.VaporPressure.Value;
      if (rainfall < 5) {
        markerOptions.fillColor = '#ff7800';
      } else if (rainfall < 10) {
        markerOptions.fillColor = '#26A69A';
      } else if (rainfall < 30) {
        markerOptions.fillColor = '#33FFBD';
      } else if (rainfall < 50) {
        markerOptions.fillColor = '#75FF33';
      } else if (rainfall < 80) {
        markerOptions.fillColor = '#DBFF33';
      } else {
        markerOptions.fillColor = '#FF7043';
      }
      this.marker = L.circleMarker([Number(e.Latitude.Value), Number(e.Longitude.Value)], markerOptions);
      this.lyrGroup.addLayer(this.marker);
    });
  }

  async  getLandVisibility() {
    await this.map.eachLayer((lyr: any) => {
      if (lyr.options.iconName == 'da') {
        this.marker.remove(lyr);
      }
    });
    const markerOptions: MarkerOptions = {
      radius: 5,
      // fillColor: "#ff7800",
      color: '#000',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.5,
      iconName: 'da'
    };

    const datArr = [];
    await datArr.push(this.numArr(this.meteo, 'LandVisibility'));
    const series = [{
      showInLegend: false,
      name: 'this.fld.descb',
      data: datArr[0]
    }];
    const category = this.txtArr(this.meteo, 0);
    this.getProChart(category, series, 'this.fld.descb', 'chart');
    this.meteo.forEach((e: any) => {
      const rainfall = e.Observe.LandVisibility.Value;
      if (rainfall < 5) {
        markerOptions.fillColor = '#ff7800';
      } else if (rainfall < 10) {
        markerOptions.fillColor = '#26A69A';
      } else if (rainfall < 30) {
        markerOptions.fillColor = '#33FFBD';
      } else if (rainfall < 50) {
        markerOptions.fillColor = '#75FF33';
      } else if (rainfall < 80) {
        markerOptions.fillColor = '#DBFF33';
      } else {
        markerOptions.fillColor = '#FF7043';
      }
      this.marker = L.circleMarker([Number(e.Latitude.Value), Number(e.Longitude.Value)], markerOptions);
      this.lyrGroup.addLayer(this.marker);
    });
  }

  async  getWindDirection() {
    await this.map.eachLayer((lyr: any) => {
      if (lyr.options.iconName == 'da') {
        this.marker.remove(lyr);
      }
    });
    const markerOptions: MarkerOptions = {
      radius: 5,
      // fillColor: "#ff7800",
      color: '#000',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.5,
      iconName: 'da'
    };

    const datArr = [];
    await datArr.push(this.numArr(this.meteo, 'WindDirection'));
    const series = [{
      showInLegend: false,
      name: 'this.fld.descb',
      data: datArr[0]
    }];
    const category = this.txtArr(this.meteo, 0);
    this.getProChart(category, series, 'this.fld.descb', 'chart');
    this.meteo.forEach((e: any) => {
      const rainfall = e.Observe.WindDirection.Value;
      if (rainfall < 5) {
        markerOptions.fillColor = '#ff7800';
      } else if (rainfall < 10) {
        markerOptions.fillColor = '#26A69A';
      } else if (rainfall < 30) {
        markerOptions.fillColor = '#33FFBD';
      } else if (rainfall < 50) {
        markerOptions.fillColor = '#75FF33';
      } else if (rainfall < 80) {
        markerOptions.fillColor = '#DBFF33';
      } else {
        markerOptions.fillColor = '#FF7043';
      }
      this.marker = L.circleMarker([Number(e.Latitude.Value), Number(e.Longitude.Value)], markerOptions);
      this.lyrGroup.addLayer(this.marker);
    });
  }

  async  getWindSpeed() {
    await this.map.eachLayer((lyr: any) => {
      if (lyr.options.iconName == 'da') {
        this.marker.remove(lyr);
      }
    });
    const markerOptions: MarkerOptions = {
      radius: 5,
      // fillColor: "#ff7800",
      color: '#000',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.5,
      iconName: 'da'
    };

    const datArr = [];
    await datArr.push(this.numArr(this.meteo, 'WindSpeed'));
    const series = [{
      showInLegend: false,
      name: 'this.fld.descb',
      data: datArr[0]
    }];
    const category = this.txtArr(this.meteo, 0);
    this.getProChart(category, series, 'this.fld.descb', 'chart');
    this.meteo.forEach((e: any) => {
      const rainfall = e.Observe.WindSpeed.Value;
      if (rainfall < 5) {
        markerOptions.fillColor = '#ff7800';
      } else if (rainfall < 10) {
        markerOptions.fillColor = '#26A69A';
      } else if (rainfall < 30) {
        markerOptions.fillColor = '#33FFBD';
      } else if (rainfall < 50) {
        markerOptions.fillColor = '#75FF33';
      } else if (rainfall < 80) {
        markerOptions.fillColor = '#DBFF33';
      } else {
        markerOptions.fillColor = '#FF7043';
      }
      this.marker = L.circleMarker([Number(e.Latitude.Value), Number(e.Longitude.Value)], markerOptions);
      this.lyrGroup.addLayer(this.marker);

    });
  }

  typeSelect(n: any) {
    console.log(n)
    if (n === 'Rainfall') {
      this.getRainfall();
    } else if (n === 'Temperature') {
      this.getTemperature();
    } else if (n === 'StationPressure') {
      this.getStationPressure();
    } else if (n === 'MeanSeaLevelPressure') {
      this.getMeanSeaLevelPressure();
    } else if (n === 'DewPoint') {
      this.getDewPoint();
    } else if (n === 'RelativeHumidity') {
      this.getRelativeHumidity();
    } else if (n === 'VaporPressure') {
      this.getVaporPressure();
    } else if (n === 'LandVisibility') {
      this.getLandVisibility();
    } else if (n === 'WindDirection') {
      this.getWindDirection();
    } else if (n === 'WindSpeed') {
      this.getWindSpeed();
    }
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
        type: 'bar',
        zoomType: 'xy'
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

export interface MarkerOptions {
  radius?: any;
  fillColor?: string;
  color?: string;
  weight?: number;
  opacity?: number;
  fillOpacity?: number;
  iconName?: any
}