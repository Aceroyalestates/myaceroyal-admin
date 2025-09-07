import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { TableColumn, TableAction } from 'src/app/shared/components/table/table.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Metrics, People } from 'src/app/core/constants';
import { Person } from 'src/app/core/types/general';
import { SharedModule } from 'src/app/shared/shared.module';
import { User } from 'src/app/core/models/users';
import { ActivatedRoute, Router } from '@angular/router';
import { RealtorService } from 'src/app/core/services/realtor.service';
import { Property } from 'src/app/core/models/properties';
import { AdminService } from 'src/app/core/services/admin.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-realtor-details',
  imports: [CommonModule, SharedModule, NzSelectModule],
  templateUrl: './realtor-details.component.html',
  styleUrl: './realtor-details.component.css',
})
export class RealtorDetailsComponent {
  userMetrics = Metrics;
  loading = false;
  error: string | null = null;
  lucy!: string;
  role!: string;
  people: Person[] = People;
  id: string = '';
  user!: User;
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
      key: 'plan.is_active',
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
    {
      key: 'edit',
      label: 'Edit',
      icon: 'edit',
      color: 'green',
      tooltip: 'Edit user',
    },
  ];

  selectedPeople = signal<Person[]>([]);

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private adminService: AdminService,
    private realtorService: RealtorService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.activatedRoute.params.subscribe({
      next: (param) => (this.id = param['id']),
    });
    this.getUser(this.id);
  }

  getUser(id: string) {
    forkJoin({
      user: this.realtorService.getRealtorById(id),
      properties: this.adminService.getUserProperties(1, id, 10, {}, true),
    }).subscribe({
      next: ({ user, properties }) => {
        this.loading = false;
        this.user = user;
        this.properties = properties.data;
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

  onRowClick(row: Person) {
    // Navigate to user details
    window.location.href = `/main/user-management/view/${row.id}/${row.name}`;
  }

  viewUser(user: Person) {
    console.log('Viewing user:', user);
    window.location.href = `/main/user-management/view/${user.id}/${user.name}`;
  }

  editUser(user: Person) {
    console.log('Editing user:', user);
    // Implement edit functionality
  }

    suspendRealtor() {
    this.loading = true;
    this.adminService.suspendAdmin(this.id).subscribe({
      next: () => {
        this.router.navigate(['/main/admin-management']);
        this.loading = false;
      },
      error: (error) => {
        console.error('An error occured: ', error.message);
        this.loading = false;
      },
    });
  }

  handleSelectedData(selected: Person[]) {
    this.selectedPeople.set(selected);
    console.log(this.selectedPeople);
  }
}
