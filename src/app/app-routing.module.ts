import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PopComponent } from './pop/pop.component';
import { RainComponent } from './rain/rain.component';
import { HotspotComponent } from './hotspot/hotspot.component';
import { AgingComponent } from './aging/aging.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'pop', component: PopComponent },
  { path: 'rain', component: RainComponent },
  { path: 'hotspot', component: HotspotComponent },
  { path: 'aging', component: AgingComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
