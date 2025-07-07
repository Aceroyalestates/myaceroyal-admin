import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';
import { AlertModalComponent } from './components/alert-modal/alert-modal.component';
import { InputComponent } from './components/input/input.component';
import { TableComponent } from './components/table/table.component';



@NgModule({
  declarations: [],
  imports: [CommonModule, ButtonComponent, AlertModalComponent, InputComponent, TableComponent],
  exports: [ButtonComponent, AlertModalComponent, InputComponent, TableComponent],
})
export class SharedModule {}
