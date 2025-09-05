import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-legal',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    BreadcrumbComponent
  ],
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.css']
})
export class LegalComponent {
  breadcrumbItems = [
    { label: 'Dashboard', link: '/main/dashboard' },
    { label: 'Legal', link: '/main/legal' }
  ];
}
