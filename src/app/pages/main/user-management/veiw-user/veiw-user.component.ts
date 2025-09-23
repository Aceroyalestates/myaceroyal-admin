import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, signal } from '@angular/core';
import {
  TableAction,
  TableColumn,
} from 'src/app/shared/components/table/table.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Metrics, People } from 'src/app/core/constants';
import { Person } from 'src/app/core/types/general';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/core/models/users';
import { forkJoin } from 'rxjs';
import { Property } from 'src/app/core/models/properties';
import { CustomerService } from 'src/app/core/services/user.service';
import { AdminService } from 'src/app/core/services/admin.service';
import { MoneyFormatPipe } from 'src/app/core/pipes/money-format.pipe';
import { FormatWordPipe } from 'src/app/core/pipes/format-word.pipe';

@Component({
  selector: 'app-veiw-user',
  imports: [CommonModule, SharedModule, NzSelectModule, MoneyFormatPipe],
  templateUrl: './veiw-user.component.html',
  styleUrl: './veiw-user.component.css',
})
export class ViewUserComponent implements OnInit {
  userMetrics = Metrics;
  lucy!: string;
  id: string = '';
  loading = false;
  error: string | null = null;
  user!: User;
  people: Person[] = People;
  properties!: Property[];
  columns: TableColumn[] = [
    {
      key: 'unit.property.name',
      title: 'Property Name',
      sortable: true,
      type: 'text',
    },
    {
      key: 'unit.property.location',
      title: 'Location',
      sortable: true,
      type: 'text',
    },
    {
      key: 'unit.unit_type.name',
      title: 'Unit type',
      sortable: true,
      type: 'text',
    },
    {
      key: 'quantity',
      title: 'Unit Qty',
      sortable: true,
      type: 'text',
    },
    {
      key: 'total_price',
      title: 'Price',
      sortable: true,
      type: 'text',
    },
    {
      key: 'formatted_status',
      title: 'Payment Status',
      sortable: true,
      type: 'text',
    },
  ];

  actions: TableAction[] = [
    {
      key: 'view',
      label: 'View',
      icon: 'eye',
      color: 'blue',
      tooltip: 'View details',
    },
  ];
  selectedPeople = signal<Person[]>([]);

  private formatWordPipe = new FormatWordPipe();

  constructor(
    private customerService: CustomerService,
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    // Optional effect to react to selected people changes
    effect(() => {
      console.log('Selected people from table:', this.selectedPeople());
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.activatedRoute.params.subscribe({
      next: (param) => (this.id = param['id']),
    });
    this.getUser(this.id);
  }

  getUser(id: string) {
    forkJoin({
      user: this.customerService.getUserById(id),
      properties: this.adminService.getUserProperties(1, id, 10, {}, true),
    }).subscribe({
      next: ({ user, properties }) => {
        this.loading = false;
        this.user = user;
        this.properties = properties.data.map((property: any) => ({
          ...property,
          formatted_status: this.formatWordPipe.transform(property.status),
        }));
      },
      error: (error) => {
        this.loading = false;
        console.error('An error occured: ', error.message);
      },
    });
  }

  onSelectionChange(selected: Person[]) {
    this.selectedPeople.set(selected);
    console.log('Selected people:', this.selectedPeople());
  }

  onTableAction(event: { action: string; row: Person }) {
    console.log('Table action:', event.action, 'Row:', event.row);
    switch (event.action) {
      case 'view':
        this.viewUser(event.row);
        break;
      case 'edit':
        this.editUser(event.row);
        break;
    }
  }

  onRowClick(row: any) {
    // Navigate to property details
    console.log('Row clicked:', row);
    this.router.navigate([
      '/main/user-management/view',
      this.id,
      this.user?.full_name || 'User',
      row.id,
      row.name || row.unit?.property?.name || 'Property',
    ]);
  }

  viewUser(user: any) {
    console.log('Viewing user:', user);
    this.router.navigate([
      '/main/user-management/view',
      this.id,
      this.user?.full_name || 'User',
      user.id,
      user.name || user.unit?.property?.name || 'Property',
    ]);
    // Already on user view page, could scroll to details or open modal
  }

  editUser(user: any) {
    console.log('Editing user:', user);
    this.router.navigate(['/main/user-management/edit', user.id]);
    // Implement edit functionality
  }

  handleSelectedData(selected: Person[]) {
    this.selectedPeople.set(selected);
    console.log(this.selectedPeople);
  }
}
