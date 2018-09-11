import { NgModule } from '@angular/core';

import { TreeModule } from 'angular-tree-component';

import { ThemeModule } from '../../@theme/theme.module';
import { ComponentsRoutingModule, routedComponents } from './components-routing.module';

@NgModule({
  imports: [
    ThemeModule,
    ComponentsRoutingModule,
    TreeModule,
  ],
  declarations: [
    ...routedComponents,
  ],
})
export class ComponentsModule { }
