import { async } from '@angular/core/testing';
import { DataService } from './../data.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ahp',
  templateUrl: './ahp.component.html',
  styleUrls: ['./ahp.component.scss']
})
export class AhpComponent implements OnInit {
  public tables: any;
  public tb: any;
  public tbName = '';
  public fields: any;
  public fld: any;
  public fldName = '';
  public radio: any;
  public score: any;

  public dataSel = [];
  public lstCorr_sel: any = [];
  public notifyCorr: string;

  public fac_a: any;
  public fac_b: any;
  public fac_c: any;
  public fac_d: any;
  public fac_e: any;


  public a1 = 1;
  public a2: any;
  public a3: number;
  public a4: number;
  public a5: number;
  public b1: number;
  public b2 = 1;
  public b3: number;
  public b4: number;
  public b5: number;
  public c1: number;
  public c2: number;
  public c3 = 1;
  public c4: number;
  public c5: number;
  public d1: number;
  public d2: number;
  public d3: number;
  public d4 = 1;
  public d5: number;
  public e1: number;
  public e2: number;
  public e3: number;
  public e4: number;
  public e5 = 1;

  public sum_a: any = 0;
  public sum_b: any = 0;
  public sum_c: any = 0;
  public sum_d: any = 0;
  public sum_e: any = 0;


  public norm_a: any = 0;
  public norm_b: any = 0;
  public norm_c: any = 0;
  public norm_d: any = 0;
  public norm_e: any = 0;

  public consist_a: any = 0;
  public consist_b: any = 0;
  public consist_c: any = 0;
  public consist_d: any = 0;
  public consist_e: any = 0;

  public eigenVector: any;
  public eigen_a = 0;
  public eigen_b = 0;
  public eigen_c = 0;
  public eigen_d = 0;
  public eigen_e = 0;

  public n = 5;
  public cr: any = 0;
  public ci: any = 0;
  public l: any = 0;

  public selItem: any = [
    {
      'name': '1/9',
      'val': 0.11
    }, {
      'name': '1/7',
      'val': 0.14
    }, {
      'name': '1/5',
      'val': 0.2
    }, {
      'name': '1/3',
      'val': 0.33
    }, {
      'name': '1',
      'val': 1
    }, {
      'name': '3',
      'val': 3
    }, {
      'name': '5',
      'val': 5
    }, {
      'name': '7',
      'val': 7
    }, {
      'name': '9',
      'val': 9
    }
  ];

  constructor(
    public dataService: DataService
  ) { }

  async ngOnInit() {
    this.listTable();
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

  selectData(e: any) {
    this.fldName = e.descb;
    // this.listYear();
  }

  typeSelect(a: any) {

    // this.score = a;
    // console.log(a);
  }

  async addParam() {
    let datArr: DataObj = {};
    if (!this.fld || this.fld.code.length < 1) {
      this.notifyCorr = 'กรุณาเลือกข้อมูลที่ต้องการวิเคราะห์';
    } else {
      this.notifyCorr = '';
      datArr = {
        tb: this.tb.table,
        tbName: this.tb.data,
        code: this.fld.code,
        descb: this.fld.descb,
        id: this.fld.id,
        unit: this.fld.unit,
        // score: this.score,
      }
      this.lstCorr_sel.push(datArr);

      // console.log(datArr);
      this.dataSel.push(this.fld.descb);
      console.log(this.dataSel);
      // await this.dataService.selectDataCorr(this.tb.table, this.fld.code, this.yr.year).then((res: any) => {
      //   this.datCorr_sel.push(res.data);
      //   this.createDom();
      // });
    }
  }



  calAHP(i: any, e: any) {
    // console.log(e);
    if (i === 'a2') {
      this.a2 = this.calWeight(Number(e.target.value));

    } else if (i === 'a3') {
      this.a3 = this.calWeight(Number(e.target.value));
    } else if (i === 'b3') {
      this.b3 = this.calWeight(Number(e.target.value));
    } else if (i === 'a4') {
      this.a4 = this.calWeight(Number(e.target.value));
    } else if (i === 'b4') {
      this.b4 = this.calWeight(Number(e.target.value));
    } else if (i === 'c4') {
      this.c4 = this.calWeight(Number(e.target.value));
    } else if (i === 'a5') {
      this.a5 = this.calWeight(Number(e.target.value));
    } else if (i === 'b5') {
      this.b5 = this.calWeight(Number(e.target.value));
    } else if (i === 'c5') {
      this.c5 = this.calWeight(Number(e.target.value));
    } else if (i === 'd5') {
      this.d5 = this.calWeight(Number(e.target.value));
    }
  }

  calWeight(i: any) {
    if (i === 0.11) {
      return 9;
    } else if (i === 0.14) {
      return 7;
    } else if (i === 0.2) {
      return 5;
    } else if (i === 0.33) {
      return 3;
    } else if (i === 1) {
      return 1;
    } else if (i === 3) {
      return 0.33;
    } else if (i === 5) {
      return 0.2;
    } else if (i === 7) {
      return 0.14;
    } else if (i === 9) {
      return 0.11;
    }
  }

  sumWeight() {
    this.sum_a = Number(this.a1) + Number(this.a2) + Number(this.a3) + Number(this.a4) + Number(this.a5);
    this.sum_b = Number(this.b1) + Number(this.b2) + Number(this.b3) + Number(this.b4) + Number(this.b5);
    this.sum_c = Number(this.c1) + Number(this.c2) + Number(this.c3) + Number(this.c4) + Number(this.c5);
    this.sum_d = Number(this.d1) + Number(this.d2) + Number(this.d3) + Number(this.d4) + Number(this.d5);
    this.sum_e = Number(this.e1) + Number(this.e2) + Number(this.e3) + Number(this.e4) + Number(this.e5);
    this.normSum();
  }

  normSum() {
    this.norm_a = (Number(this.a1) / this.sum_a) + (Number(this.b1) / this.sum_b) + (Number(this.c1) / this.sum_c) + (Number(this.d1) / this.sum_d) + (Number(this.e1) / this.sum_e);
    this.norm_b = (Number(this.a2) / this.sum_a) + (Number(this.b2) / this.sum_b) + (Number(this.c2) / this.sum_c) + (Number(this.d2) / this.sum_d) + (Number(this.e2) / this.sum_e);
    this.norm_c = (Number(this.a3) / this.sum_a) + (Number(this.b3) / this.sum_b) + (Number(this.c3) / this.sum_c) + (Number(this.d3) / this.sum_d) + (Number(this.e3) / this.sum_e);
    this.norm_d = (Number(this.a4) / this.sum_a) + (Number(this.b4) / this.sum_b) + (Number(this.c4) / this.sum_c) + (Number(this.d4) / this.sum_d) + (Number(this.e4) / this.sum_e);
    this.norm_e = (Number(this.a5) / this.sum_a) + (Number(this.b5) / this.sum_b) + (Number(this.c5) / this.sum_c) + (Number(this.d5) / this.sum_d) + (Number(this.e5) / this.sum_e);
    this.eigenCal();
  }


  async eigenCal() {

    this.eigen_a = await this.norm_a / Number(this.n);
    this.eigen_b = await this.norm_b / Number(this.n);
    this.eigen_c = await this.norm_c / Number(this.n);
    this.eigen_d = await this.norm_d / Number(this.n);
    this.eigen_e = await this.norm_e / Number(this.n);

    console.log(this.norm_a, this.n);
    console.log(this.eigen_a);

    this.eigenVector = [
      { name: 'a', value: this.eigen_a },
      { name: 'b', value: this.eigen_b },
      { name: 'c', value: this.eigen_c },
      { name: 'd', value: this.eigen_d },
      { name: 'e', value: this.eigen_e }
    ];
    this.consistCal();
  }

  consistCal() {
    this.consist_a = ((Number(this.a1) * this.eigen_a) + (Number(this.b1) * this.eigen_b) + (Number(this.c1) * this.eigen_c) + (Number(this.d1) * this.eigen_d) + (Number(this.e1) * this.eigen_e)) / this.eigen_a;
    this.consist_b = ((Number(this.a2) * this.eigen_a) + (Number(this.b2) * this.eigen_b) + (Number(this.c2) * this.eigen_c) + (Number(this.d2) * this.eigen_d) + (Number(this.e2) * this.eigen_e)) / this.eigen_b;
    this.consist_c = ((Number(this.a3) * this.eigen_a) + (Number(this.b3) * this.eigen_b) + (Number(this.c3) * this.eigen_c) + (Number(this.d3) * this.eigen_d) + (Number(this.e3) * this.eigen_e)) / this.eigen_c;
    this.consist_d = ((Number(this.a4) * this.eigen_a) + (Number(this.b4) * this.eigen_b) + (Number(this.c4) * this.eigen_c) + (Number(this.d4) * this.eigen_d) + (Number(this.e4) * this.eigen_e)) / this.eigen_d;
    this.consist_e = ((Number(this.a5) * this.eigen_a) + (Number(this.b5) * this.eigen_b) + (Number(this.c5) * this.eigen_c) + (Number(this.d5) * this.eigen_d) + (Number(this.e5) * this.eigen_e)) / this.eigen_e;

    this.l = (this.consist_a + this.consist_b + this.consist_c + this.consist_d + this.consist_e) / this.n;
    this.ci = (this.l - this.n) / (this.n - 1);
    this.cr = this.ci / 1.12;
  }


}

export interface DataObj {
  code?: any;
  id?: number;
  descb?: string;
  unit?: string;
  score?: string;
  tb?: string;
  tbName?: string;
}
