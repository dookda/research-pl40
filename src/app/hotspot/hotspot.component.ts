import { async } from '@angular/core/testing';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import * as L from 'leaflet';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-hotspot',
  templateUrl: './hotspot.component.html',
  styleUrls: ['./hotspot.component.scss']
})
export class HotspotComponent implements OnInit {

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

  public lyrAqi: any;
  public hpModis: any;
  public hpViirs: any;
  public hpSum: any;

  constructor(
    public dataService: DataService
  ) { }

  ngOnInit() {
    this.center = [13.0, 101.1];
    this.zoom = 6;
    this.loadmap();
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

    this.lyrAqi = L.layerGroup();

    const baseLayers = {
      'map box': this.mbox,
      'แผนที่ถนน': this.grod,
      'แผนที่ภาพดาวเทียม': this.ghyb,
      'แผนที่ภูมิประเทศ': this.gter.addTo(this.map),
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
    this.loadVirrs();
    this.loadModis();
    this.loadAqi();
  }

  async  loadVirrs() {
    await this.dataService.getViirs().then((res: any) => {
      this.hpViirs = res.th;
      this.sumHp();
      L.geoJSON(res.data, {
        pointToLayer: function (feature: any, latlng: any) {
          return L.circleMarker(latlng, {
            radius: 4,
            fillColor: '#f44b42',
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.5,
            iconName: 'da'
          });
        },
        onEachFeature: (feature: any, layer: any) => {
          if (feature.properties) {
            layer.bindPopup(
              'lat: ' + feature.properties.latitude +
              '<br/>lon: ' + feature.properties.longitude +
              '<br/>satellite: ' + feature.properties.satellite +
              '<br/>acq_date: ' + feature.properties.acq_date
            );
          }
        }
      }).addTo(this.map);
    });
  }

  async  loadModis() {
    await this.dataService.getModis().then((res: any) => {
      this.hpModis = res.th;
      L.geoJSON(res.data, {
        pointToLayer: function (feature: any, latlng: any) {
          return L.circleMarker(latlng, {
            radius: 4,
            fillColor: '#f44b42',
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.5,
            iconName: 'da'
          });
        },
        onEachFeature: (feature: any, layer: any) => {
          if (feature.properties) {
            layer.bindPopup(
              'lat: ' + feature.properties.latitude +
              '<br/>lon: ' + feature.properties.longitude +
              '<br/>satellite: ' + feature.properties.satellite +
              '<br/>acq_date: ' + feature.properties.acq_date
            );
          }
        }
      }).addTo(this.map);
    });
  }

  async loadAqi() {
    this.dataService.getAirquality().then((res: any) => {
      // console.log(res.stations);
      const aqi = res.stations;

      aqi.forEach((e: any) => {

        let aqiTxt: any, ic: any;
        if (e.LastUpdate.AQI.aqi > 200) {
          aqiTxt = 'มีผบกระทบต่อสุขภาพ';
          ic = L.icon({
            iconUrl: 'http://cgi.uru.ac.th/fire_assets/img/aqi5.png',
            iconSize: [32, 37],
            iconAnchor: [12, 37],
            popupAnchor: [5, -36]
          });
        } else if (e.LastUpdate.AQI.aqi > 101) {
          aqiTxt = 'เริ่มมีผลกระทบต่อสุขภาพ';
          ic = L.icon({
            iconUrl: 'http://cgi.uru.ac.th/fire_assets/img/aqi4.png',
            iconSize: [32, 37],
            iconAnchor: [12, 37],
            popupAnchor: [5, -36]
          });
        } else if (e.LastUpdate.AQI.aqi > 51) {
          aqiTxt = 'ปานกลาง';
          ic = L.icon({
            iconUrl: 'http://cgi.uru.ac.th/fire_assets/img/aqi3.png',
            iconSize: [32, 37],
            iconAnchor: [12, 37],
            popupAnchor: [5, -36]
          });
        } else if (e.LastUpdate.AQI.aqi > 26) {
          aqiTxt = 'ดี';
          ic = L.icon({
            iconUrl: 'http://cgi.uru.ac.th/fire_assets/img/aqi2.png',
            iconSize: [32, 37],
            iconAnchor: [12, 37],
            popupAnchor: [5, -36]
          });
        } else {
          aqiTxt = 'ดีมาก';
          ic = L.icon({
            iconUrl: 'http://cgi.uru.ac.th/fire_assets/img/aqi1.png',
            iconSize: [32, 37],
            iconAnchor: [12, 37],
            popupAnchor: [5, -36]
          });
        }

        L.marker([Number(e.lat), Number(e.long)], {
          icon: ic
        }).addTo(this.map).bindPopup('<h5>สถานีตรวจวัดคุณภาพอากาศ ' + e.nameTH + '</h5>' +
          '<br/><span >สถานที่:</span>' + e.areaTH +
          '<br/><span >ค่า AQI:</span>' + e.LastUpdate.AQI.aqi +
          '<br/><span >ระดับคุณภาพอากาศ (AQI):</span>' + aqiTxt +
          '<br/><span >CO:</span>' + e.LastUpdate.CO.value +
          '<br/><span >NO2:</span>' + e.LastUpdate.NO2.value +
          ' <br/><span >O3:</span>' + e.LastUpdate.O3.value +
          '<br/><span >PM10:</span>' + e.LastUpdate.PM10.value +
          '<br/><span >PM25:</span>' + e.LastUpdate.PM25.value +
          '<br/><span >SO2:</span>' + e.LastUpdate.SO2.value +
          '<br/>ที่มา: กรมควบคุมมลพิษ (http://air4thai.pcd.go.th)'
        );

      });
    });
  }

  sumHp() {
    this.hpSum = this.hpViirs + this.hpModis;
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