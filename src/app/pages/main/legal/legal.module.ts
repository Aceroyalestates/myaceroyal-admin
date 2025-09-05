import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Ng-Zorro imports
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

// Shared modules
import { SharedModule } from 'src/app/shared/shared.module';

// Routing
import { LegalRoutingModule } from './legal-routing.module';

// Components
import { LegalComponent } from './legal.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    LegalRoutingModule,
    
    // Ng-Zorro modules
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    
    // Standalone components
    LegalComponent
  ]
})
export class LegalModule { }
