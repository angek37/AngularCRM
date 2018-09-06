import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import {HomeComponent} from './home/home.component';
import {CuentasComponent} from './cuentas/cuentas.component';
import {ContactosComponent} from './contactos/contactos.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [{
    path: 'dashboard',
    component: HomeComponent,
  }, {
    path: 'cuentas',
    component: CuentasComponent,
  }, {
    path: 'contactos',
    component: ContactosComponent,
  }, {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  }, {
    path: '**',
    redirectTo: 'dashboard',
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
