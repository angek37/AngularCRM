import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { HomeComponent } from './home/home.component';
import { CuentasComponent } from './cuentas/cuentas.component';
import { ContactosComponent } from './contactos/contactos.component';
import { VentasChartComponent } from './home/charts/ventas-chart/ventas-chart.component';
import {NgxEchartsModule} from 'ngx-echarts';
import { OportunidadesChartComponent } from './home/charts/oportunidades-chart/oportunidades-chart.component';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import { MapChartComponent } from './home/charts/map-chart/map-chart.component';
import {NbSpinnerModule} from '@nebular/theme';
import {FormsModule} from '@angular/forms';
import {ToasterModule} from 'angular2-toaster';

const PAGES_COMPONENTS = [
  PagesComponent,
  HomeComponent,
  CuentasComponent,
  ContactosComponent,
  VentasChartComponent,
  OportunidadesChartComponent,
  MapChartComponent
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NgxEchartsModule,
    Ng2SmartTableModule,
    NbSpinnerModule,
    FormsModule,
    ToasterModule.forRoot()
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
})
export class PagesModule {
}
