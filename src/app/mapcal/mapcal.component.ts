import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

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
  public data: any;
  public dat: any;
  public year: any;
  public yr: any;

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
    this.listYear();
  }

  listYear() {
    this.dataService.listYear(this.tb.table).then((res: any) => {
      this.year = res.data;
      this.yr = null;
    });
  }

}
