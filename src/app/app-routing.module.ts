import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegressionComponent } from './regression/regression.component';
import { MapcalComponent } from './mapcal/mapcal.component';
import { RainComponent } from './rain/rain.component';
import { HotspotComponent } from './hotspot/hotspot.component';
import { DisasterComponent } from './disaster/disaster.component';
import { FieldComponent } from './field/field.component';
import { PopComponent } from './pop/pop.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'regression', component: RegressionComponent },
  { path: 'mapcal', component: MapcalComponent },
  { path: 'pop', component: PopComponent },
  { path: 'rain', component: RainComponent },
  { path: 'hotspot', component: HotspotComponent },
  { path: 'disaster', component: DisasterComponent },
  { path: 'field', component: FieldComponent },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
