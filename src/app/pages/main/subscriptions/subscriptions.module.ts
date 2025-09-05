import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Ng-Zorro imports
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

// Shared modules
import { SharedModule } from 'src/app/shared/shared.module';

// Routing
import { SubscriptionsRoutingModule } from './subscriptions-routing.module';

// Components
import { SubscriptionsComponent } from './subscriptions.component';
import { ReportComponent } from './report/report.component';
import { SubscriptionDetailsComponent } from './subscription-details/subscription-details.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    SubscriptionsRoutingModule,
    
    // Ng-Zorro modules
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzTagModule,
    NzSelectModule,
    NzDatePickerModule,
    
    // Standalone components
    SubscriptionsComponent,
    ReportComponent,
    SubscriptionDetailsComponent
  ]
})
export class SubscriptionsModule { }
