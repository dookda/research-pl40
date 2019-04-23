import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapcalComponent } from './mapcal.component';

describe('MapcalComponent', () => {
  let component: MapcalComponent;
  let fixture: ComponentFixture<MapcalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapcalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapcalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
