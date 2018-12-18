import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  public url = 'http://map.nu.ac.th/geoserver-hgis/hgis/ows?service=WFS&version=1.0.0&request=GetFeature&';
  constructor(
    public http: HttpClient
  ) { }

  getAllPro() {
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:3000/api/getprov')
        .subscribe((res: any) => {
          resolve(res);
        }, (error) => {
          reject(error);
        });
    });
  }

  getAllAmp(provcode: any) {
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:3000/api/getamp/' + provcode)
        .subscribe((res: any) => {
          resolve(res);
        }, (error) => {
          reject(error);
        });
    });
  }

  getAllTam(ampcode: any) {
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:3000/api/gettam/' + ampcode)
        .subscribe((res: any) => {
          resolve(res);
        }, (error) => {
          reject(error);
        });
    });
  }

  getTam() {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + 'typeName=hgis:dpc9_amphoe_4326&cqlfilter=prov_code=65&outputFormat=application%2Fjson')
        .subscribe((res: any) => {
          resolve(res);
        }, (error) => {
          reject(error);
        });
    });
  }

  getAllPop() {
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:3000/api/allpop')
        .subscribe((res) => {
          resolve(res);
        }, (error) => {
          reject(error);
        });
    });
  }

  getPop(type: any, code: any, year: any) {
    const host = 'http://localhost:3000/api/';
    let uri;

    if (type === 'tam') {
      uri = host + 'poptam/' + code + '/' + year;
    } else if (type === 'amp') {
      uri = host + 'popamp/' + code + '/' + year;
    } else if (type === 'prov') {
      uri = host + 'poppro/' + code + '/' + year;
    } else {
      uri = host + 'popth/' + year;
    }

    return new Promise((resolve, reject) => {
      this.http.get(uri).subscribe((res) => {
        // console.log(uri);
        resolve(res);
      }, (error) => {
        reject(error);
      });
    });
  }


}
