import { Component, effect, signal } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { TableColumn, TableAction } from 'src/app/shared/components/table/table.component';
import { CommonModule } from '@angular/common';
import { IconComponent } from 'src/app/shared/components/icon/icon.component';
import { Person, Metric, Property } from 'src/app/core/types/general';
import { Metrics, People, Properties } from 'src/app/core/constants';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    SharedModule,
    IconComponent,
    FormsModule,
    NzSelectModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  people: Person[] = People;
  lucy!:string
  columns: TableColumn[] = [
    { 
      key: 'name', 
      title: 'Name',
      sortable: false,
      type: 'text'
    },
    { 
      key: 'email', 
      title: 'Email',
      sortable: false,
      type: 'text'
    },
    { 
      key: 'age', 
      title: 'Age',
      sortable: false,
      type: 'text'
    },
  ];

  selectedPeople = signal<Person[]>([]);
  metrics: Metric[] = Metrics;

  properties: Property[] = Properties;
  constructor() {
    // Optional effect to react to selected people changes
    effect(() => {
      console.log('Selected people from table:', this.selectedPeople());
    });
  }

  onSelectionChange(selected: Person[]) {
    this.selectedPeople.set(selected);
    console.log('Selected people:', this.selectedPeople());
  }

  handleSelectedData(selected: Person[]) {
    this.selectedPeople.set(selected);
    console.log(this.selectedPeople);
  }
  getTransparentColor(hex: string): string {
    // Convert HEX to rgba
    if (!hex.startsWith('#')) return hex;

    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, 0.12)`;
  }
}
