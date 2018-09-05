import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { HomeComponent } from './home/home.component';
import { CuentasComponent } from './cuentas/cuentas.component';
import { ContactosComponent } from './contactos/contactos.component';
import { VentasChartComponent } from './home/charts/ventas-chart/ventas-chart.component';
import {NgxEchartsModule} from 'ngx-echarts';
import { OportunidadesChartComponent } from './home/charts/oportunidades-chart/oportunidades-chart.component';

const PAGES_COMPONENTS = [
  PagesComponent,
  HomeComponent,
  CuentasComponent,
  ContactosComponent,
  VentasChartComponent,
  OportunidadesChartComponent
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    DashboardModule,
    MiscellaneousModule,
    NgxEchartsModule,
  ],
  declarations: [
    ...PAGES_COMPONENTS
  ],
})
export class PagesModule {
}
