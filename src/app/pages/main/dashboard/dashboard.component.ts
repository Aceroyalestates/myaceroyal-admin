import { Component } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-dashboard',
  imports: [SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  columns = [
    { title: 'Name', key: 'name' },
    { title: 'Age', key: 'age' },
    { title: 'Address', key: 'address' },
  ];

  data = [
    { name: 'John Doe', age: 28, address: 'Lagos' },
    { name: 'Jane Smith', age: 34, address: 'Abuja' },
    { name: 'John Doe', age: 28, address: 'Lagos' },
    { name: 'Jane Smith', age: 34, address: 'Abuja' },
    { name: 'John Doe', age: 28, address: 'Lagos' },
    { name: 'Jane Smith', age: 34, address: 'Abuja' },
  ];
}
