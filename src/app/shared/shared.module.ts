import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';
import { AlertModalComponent } from './components/alert-modal/alert-modal.component';
import { InputComponent } from './components/input/input.component';



@NgModule({
  declarations: [],
  imports: [CommonModule, ButtonComponent, AlertModalComponent, InputComponent],
  exports: [ButtonComponent, AlertModalComponent, InputComponent],
})
export class SharedModule {}
