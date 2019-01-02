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

  getDataHeader() {
    const db = [
      {
        id: 1,
        data: 'สถิติคดีอุบัติเหตุการจราจรทางบก',
        desc: 'จำแนกตามสาเหตุที่เกิดอุบัติเหตุ',
        unit: 'คดี',
        table: 'accident'
      },
      {
        id: 2,
        data: 'แรงงานต่างด้าว',
        desc: 'ที่ได้รับอนุญาตทำงานคงเหลือ',
        unit: 'คน',
        table: 'alien'
      },
      {
        id: 10,
        data: 'จำนวนประชากรอายุ 15 ปีขึ้นไป',
        desc: 'จำแนกตามสถานภาพแรงงาน และเพศ',
        unit: 'คน',
        table: 'labor'
      },
      {
        id: 3,
        data: 'จำนวนประชากรอายุ 15 ปีขึ้นไป ที่มีงานทำ',
        desc: 'จำแนกตามอาชีพ และเพศ',
        unit: 'คน',
        table: 'career'
      },
      {
        id: 4,
        data: 'จำนวนการตาย',
        desc: 'จำแนกตามสาเหตุการตาย และเพศ',
        unit: 'คน',
        table: 'dead'
      },
      {
        id: 5,
        data: 'จำนวนผู้ต้องหา',
        desc: 'จำแนกตามชนิดยาเสพติดเป็นรายจังหวัด',
        unit: 'คน',
        table: 'drugs'
      },
      {
        id: 6,
        data: 'ผลิตภัณฑ์จังหวัด',
        desc: ' อนุกรมใหม่ ตามราคาประจำปี จำแนกตามสาขาการผลิต',
        unit: 'ล้านบาท',
        table: 'gppa'
      },
      {
        id: 7,
        data: 'ผลิตภัณฑ์มวลรวมในประเทศแบบปริมาณลูกโซ่',
        desc: '(อ้างอิงปี พ.ศ. 2545)จำแนกตามสาขาการผลิต',
        unit: 'ล้านบาท',
        table: 'gpps'
      },
      {
        id: 8,
        data: 'ครัวเรือนยากจน',
        desc: 'จำนวนครัวเรือนที่คนในครัวเรือนมีรายได้เฉลี่ยน้อยกว่า 30,000 บาท/คน/เดือน',
        unit: 'บาท/คน/เดือน',
        table: 'households'
      },
      {
        id: 9,
        data: 'จำนวนผู้ป่วยใน',
        desc: 'จำแนกตามกลุ่มสาเหตุป่วย 75 โรค',
        unit: 'คน',
        table: 'ipd'
      },
      {
        id: 11,
        data: 'สถิติการรับแจ้งคดีอุบัติเหตุการจราจรทางบก ',
        desc: 'จำแนกตามประเภทรถ ความเสียหาย และผู้ต้องหา',
        unit: 'คน',
        table: 'notice'
      },
      {
        id: 12,
        data: 'จำนวนผู้ป่วยนอก',
        desc: 'จำแนกตามกลุ่มสาเหตุป่วย 21 โรค จากสถานบริการสาธารณสุขของกระทรวงสาธารณสุข',
        unit: 'คน',
        table: 'opd'
      },
      {
        id: 13,
        data: 'จำนวนคนจน',
        desc: '',
        unit: 'คน',
        table: 'poor'
      },
      {
        id: 14,
        data: 'เส้นความยากจน',
        desc: 'ด้านรายจ่าย',
        unit: 'บาท/คน/เดือน',
        table: 'poverty'
      },
      {
        id: 15,
        data: 'ท้องก่อนวัยอันควร',
        desc: '',
        unit: 'คน',
        table: 'pregnency'
      },
      {
        id: 16,
        data: 'ประกันสังคม',
        desc: '',
        unit: 'คน',
        table: 'social'
      },
    ];

    return db;
  }

  getFieldFromSelectedTable(tb: string) {
    const uri = 'http://localhost:3000/api/getListField/' + tb;
    return new Promise((resolve, reject) => {
      this.http.get(uri).subscribe((res: any) => {
        resolve(res);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  getDataFromSelectedTable(tb: string) {
    const uri = 'http://localhost:3000/api/getDatapool/' + tb;
    return new Promise((resolve, reject) => {
      this.http.get(uri).subscribe((res: any) => {
        resolve(res);
        // res.
      }, (error: any) => {
        reject(error);
      });
    });
  }

  getDataYear(tb: string) {
    const uri = 'http://localhost:3000/api/getDataYear/' + tb;
    return new Promise((resolve, reject) => {
      this.http.get(uri).subscribe((res: any) => {
        resolve(res);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  getSelectedData(tb: string, col: string) {
    const uri = 'http://localhost:3000/api/getSelectedData/' + tb + '/' + col;
    return new Promise((resolve, reject) => {
      this.http.get(uri).subscribe((res: any) => {
        resolve(res);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  getSelectedSubData(tb: string, col: string, where: string) {
    const uri = 'http://localhost:3000/api/getSelectedSubData/' + tb + '/' + col + '/' + where;
    return new Promise((resolve, reject) => {
      this.http.get(uri).subscribe((res: any) => {
        resolve(res);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  getDataCorr(tb: string, col: string, year: string) {
    const uri = 'http://localhost:3000/api/getDataCorr/' + tb + '/' + col + '/' + year;
    return new Promise((resolve, reject) => {
      this.http.get(uri).subscribe((res: any) => {
        resolve(res);
      }, (error: any) => {
        reject(error);
      });
    });
  }





}
