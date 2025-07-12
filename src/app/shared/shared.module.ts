import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';
import { AlertModalComponent } from './components/alert-modal/alert-modal.component';
import { InputComponent } from './components/input/input.component';
import { TableComponent } from './components/table/table.component';
import { IconComponent } from './components/icon/icon.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { PropertyCardComponent } from './components/property-card/property-card.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ButtonComponent,
    AlertModalComponent,
    InputComponent,
    TableComponent,
    IconComponent,
    SearchBarComponent,
    PropertyCardComponent,
    BreadcrumbComponent,
  ],
  exports: [
    ButtonComponent,
    AlertModalComponent,
    InputComponent,
    TableComponent,
    IconComponent,
    SearchBarComponent,
    PropertyCardComponent,
    BreadcrumbComponent,
  ],
})
export class SharedModule {}
