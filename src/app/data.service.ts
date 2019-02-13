import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  public dat: any;
  public url = 'http://localhost:3000/pro40';
  public uri = 'http://localhost:3000';

  constructor(
    public http: HttpClient
  ) { }

  listTable() {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + '/listtable').subscribe((res: any) => {
        resolve(res);
      }, (err: any) => {
        reject(err);
      });
    });
  }

  listField(tb: any) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + '/listfield/' + tb).subscribe((res: any) => {
        resolve(res);
      }, (err: any) => {
        reject(err);
      });
    });
  }

  selectData(tb: any, fld: any) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + '/selectdata/' + tb + '/' + fld).subscribe((res: any) => {
        resolve(res);
      }, (err: any) => {
        reject(err);
      });
    });
  }

  selectGeomByYear(tb: any, fld: any, yr: any) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + '/selectgeombyyear/' + tb + '/' + fld + '/' + yr).subscribe((res: any) => {
        resolve(res);
      }, (err: any) => {
        reject(err);
      });
    });
  }

  selectDataByYear(tb: any, fld: any, yr: any) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + '/selectdatabyyear/' + tb + '/' + fld + '/' + yr).subscribe((res: any) => {
        resolve(res);
      }, (err: any) => {
        reject(err);
      });
    });
  }

  selectDataCorr(tb: any, fld: any, yr: any) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + '/selectdatacorr/' + tb + '/' + fld + '/' + yr).subscribe((res: any) => {
        resolve(res);
      }, (err: any) => {
        reject(err);
      });
    });
  }

  listYear(tb: any) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + '/listyear/' + tb).subscribe((res: any) => {
        resolve(res);
      }, (err: any) => {
        reject(err);
      });
    });
  }

  getTMD() {
    return new Promise((resolve: any, reject: any) => {
      this.http.get('https://data.tmd.go.th/api/Weather3Hours/V1/?type=json').subscribe((res: any) => {
        resolve(res);
      }, (err: any) => {
        reject(err)
      })
    })
  }

  getViirs() {
    return new Promise((resolve: any, reject: any) => {
      this.http.get(this.uri + '/hp/hp_viirs_th').subscribe((res: any) => {
        resolve(res);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  getModis() {
    return new Promise((resolve: any, reject: any) => {
      this.http.get(this.uri + '/hp/hp_modis_th').subscribe((res: any) => {
        resolve(res);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  getAirquality() {
    const json = 'http://air4thai.pcd.go.th/services/getNewAQI_JSON.php';
    return new Promise((resolve: any, reject: any) => {
      this.http.get(json).subscribe((res: any) => {
        resolve(res);
      }, (error: any) => {
        reject(error);
      });
    });
  }

}
