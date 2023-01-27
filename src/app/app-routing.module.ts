import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForecastPageComponent } from './forecast-page/forecast-page.component';
import { InitalPageComponent } from './inital-page/inital-page.component';

const routes: Routes = [
  {
    path: '',
    component: InitalPageComponent,
  },
  {
    path: 'forecast/:name',
    component: ForecastPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
