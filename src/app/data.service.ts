import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  public dat: any;
  public url = 'http://cgi.uru.ac.th:3000/pro40';
  public uri = 'http://cgi.uru.ac.th:3000';

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

    // tslint:disable-next-line: max-line-length
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjhlOWIxZTkwMjU4OGMyMzlhZWFhMzBjYzRmMTA3MWNlNWYzNzBkNWQ3NjdkMzRmMDQ2OGZmNDM5MzM1YWQyZTFmZjI4NWM5NjQzYmQyNTRhIn0.eyJhdWQiOiIyIiwianRpIjoiOGU5YjFlOTAyNTg4YzIzOWFlYWEzMGNjNGYxMDcxY2U1ZjM3MGQ1ZDc2N2QzNGYwNDY4ZmY0MzkzMzVhZDJlMWZmMjg1Yzk2NDNiZDI1NGEiLCJpYXQiOjE1NTkzODgyMzcsIm5iZiI6MTU1OTM4ODIzNywiZXhwIjoxNTkxMDEwNjM3LCJzdWIiOiI0NDQiLCJzY29wZXMiOltdfQ.ad6ThHz82lsyazL_T9ZdHaZMVtNQwZQVHII9Zx0aO07y0cursmCB8UOrGUEQY-DTxUgIsshC5On2QW84YVZ4xDsA7r-wgah7CNIjb-1p8aYPkEMxZ12UHe4w7dh9jYxqRT6I44w5VBQRIgSx0-2RqaP-IZ1XBWRl3ocvhIzzQmJ-hfJNrflLKS5JP6ppxd5gPUbsNi1c6yZNkMN7ArSsfNldSlMVeFdwgiTTY1lHGusLXg1Ew1IMBl3JO2XRZTQmJSlqjqjmBbBHFw7Rv8kOKCBsZpWZoGVrScXCiRutuOLGLkOlGdI3sLg2od0g1Pr9pG5RC-iITC0OC9phR8Jb1RXLenPQuzGMam2srxa-OLpumS2Mnq4R4Xq6-2f1xYOCMBRRPm4nZW3MJx6QrW8UeOatcN4vjiNtOSU5He5G2FXAmFWhWBbhYXfy1Zu5aZfoGlQueYNCQ4ZKXsWzBHOL3jT4aDagwbundx2qoHMRt667cUcN7O89wZ2QfuIElXjhBSaWikAr9twKjrv0fpdzRHH3cBxQlSp2QqfCrnl_CvpxnN3cDcIwSGBtj5WVQ_qZNzC-cvSxRgfpwwV5K46jIfJ3rUpLtf4EiyzyRBg-rSTOdZb9nVnZptVPcffAiYnSZUODq3NKGCBYM0BCt7Yb1WEJBcO9NkoQFmAS_6GjpoQ';
    // let headers = new HttpHeaders();
    // headers = headers.append('Authorization', token);
    // headers = headers.append('Accept', 'application/json');
    // headers = headers.append('Content-Type', 'application/json');
    // headers = headers.append('Access-Control-Allow-Headers', 'Content-Type');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token,
        'Access-Control-Allow-Headers': '*'
      })
    };



    return new Promise((resolve: any, reject: any) => {
      this.http.get('https://data.tmd.go.th/nwpapi/v1/forecast/location/hourly', httpOptions).subscribe((res: any) => {
        resolve(res);
      }, (err: any) => {
        reject(err)
      });
    });
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
    const json = 'https://cors.io/?http://air4thai.pcd.go.th/services/getNewAQI_JSON.php';
    return new Promise((resolve: any, reject: any) => {
      this.http.get(json).subscribe((res: any) => {
        resolve(res);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  getStat(data: any) {
    const url = 'http://cgi.uru.ac.th:5000/api/ind_ttest';
    return new Promise((resolve: any, reject: any) => {
      this.http.post(url, data).subscribe((res: any) => {
        resolve(res);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  getMapcal(tb1: any, fld1: any, yr1: any, tb2: any, fld2: any, yr2: any, exp: any) {
    return new Promise((resolve: any, reject: any) => {
      this.http.get(this.url + '/mapcal/' + tb1 + '/' + fld1 + '/' + yr1 + '/' + tb2 + '/' + fld2 + '/' + yr2 + '/' + exp).subscribe((res: any) => {
        resolve(res);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  getMapcalStat(tb1: any, fld1: any, yr1: any, tb2: any, fld2: any, yr2: any, exp: any) {
    return new Promise((resolve: any, reject: any) => {
      this.http.get(this.url + '/mapcal_stat/' + tb1 + '/' + fld1 + '/' + yr1 + '/' + tb2 + '/' + fld2 + '/' + yr2 + '/' + exp).subscribe((res: any) => {
        resolve(res);
      }, (error: any) => {
        reject(error);
      });
    });
  }

}
