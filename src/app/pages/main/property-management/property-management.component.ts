import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { NzButtonModule } from 'ng-zorro-antd/button';


@Component({
  selector: 'app-property-management',
  imports: [CommonModule, SharedModule, NzTabsModule],
  templateUrl: './property-management.component.html',
  styleUrl: './property-management.component.css',
})
export class PropertyManagementComponent {

}
