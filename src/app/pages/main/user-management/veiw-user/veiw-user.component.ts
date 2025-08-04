import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, signal } from '@angular/core';
import {
  TableColumn,
  TableAction,
} from 'src/app/shared/components/table/table.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Metrics, People } from 'src/app/core/constants';
import { Person } from 'src/app/core/types/general';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/core/models/users';
import { forkJoin } from 'rxjs';
import { Property } from 'src/app/core/models/properties';

@Component({
  selector: 'app-veiw-user',
  imports: [CommonModule, SharedModule, NzSelectModule],
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
  properties!: Property;
  columns: TableColumn[] = [
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      type: 'text',
    },
    {
      key: 'email',
      title: 'Email',
      sortable: true,
      type: 'text',
    },
    {
      key: 'age',
      title: 'Age',
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
    private dashboardService: DashboardService,
    private activatedRoute: ActivatedRoute
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
    forkJoin([
      this.dashboardService.getUserById(id),
      this.dashboardService.getAdminPropertyById(id),
    ]).subscribe({
      next: ([user, property]) => {
        this.loading = false;
        this.user = user;
        this.properties = property;
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
    window.location.href = `/user-management/view/${row.id}/${row.name}`;
  }

  viewUser(user: Person) {
    console.log('Viewing user:', user);
    // Already on user view page, could scroll to details or open modal
  }

  editUser(user: Person) {
    console.log('Editing user:', user);
    // Implement edit functionality
  }

  handleSelectedData(selected: Person[]) {
    this.selectedPeople.set(selected);
    console.log(this.selectedPeople);
  }
}
