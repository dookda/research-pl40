import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { DataService } from './data.service';
import { RegressionComponent } from './regression/regression.component';
import { MapcalComponent } from './mapcal/mapcal.component';
import { RainComponent } from './rain/rain.component';
import { HotspotComponent } from './hotspot/hotspot.component';
import { DisasterComponent } from './disaster/disaster.component';
import { FieldComponent } from './field/field.component';
import { PopComponent } from './pop/pop.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AhpComponent } from './ahp/ahp.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegressionComponent,
    MapcalComponent,
    RainComponent,
    HotspotComponent,
    DisasterComponent,
    FieldComponent,
    PopComponent,
    DashboardComponent,
    AhpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
