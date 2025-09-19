import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { TableColumn, TableAction } from 'src/app/shared/components/table/table.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { Metrics, People } from 'src/app/core/constants';
import { Person } from 'src/app/core/types/general';
import { SharedModule } from 'src/app/shared/shared.module';
import { User } from 'src/app/core/models/users';
import { ActivatedRoute, Router } from '@angular/router';
import { RealtorService } from 'src/app/core/services/realtor.service';
import { Property } from 'src/app/core/models/properties';
import { AdminService } from 'src/app/core/services/admin.service';
import { forkJoin } from 'rxjs';
import { CountryInterface, StateInterface } from 'src/app/core/models/generic';
import { Client } from 'src/app/core/models/clients';

@Component({
  selector: 'app-realtor-details',
  imports: [CommonModule, SharedModule, NzSelectModule, NzTabsModule, NzEmptyModule],
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
  nationality!: CountryInterface;
  state!: StateInterface;
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

  // Tabs state and report data (to be wired to API)
  activeTab: 'sales' | 'clients' = 'sales';
  salesColumns: TableColumn[] = [
    { key: 'property', title: 'Property', sortable: true, type: 'text' },
    { key: 'client', title: 'Client', sortable: true, type: 'text' },
    { key: 'unit', title: 'Unit', sortable: true, type: 'text' },
    { key: 'amount', title: 'Amount', sortable: true, type: 'text' },
    { key: 'status', title: 'Status', sortable: true, type: 'status' },
    { key: 'date', title: 'Date', sortable: true, type: 'text' },
  ];
  salesData: Array<{ id: string; property: string; client: string; unit: string; amount: string; status: string; date: string; }> = [];

  clientsColumns: TableColumn[] = [
    { key: 'name', title: 'Client', sortable: true, type: 'text' },
    { key: 'email', title: 'Email', sortable: true, type: 'text' },
    { key: 'phone', title: 'Phone', sortable: true, type: 'text' },
    { key: 'purchases', title: 'Purchases', sortable: true, type: 'text' },
    { key: 'total', title: 'Total Amount', sortable: true, type: 'text' },
  ];
  clientsData: Client[] = [];

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
        this.user = user;
        this.properties = properties.data;
        this.fetchNationalityAndState();
        this.loadClientsData();
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  fetchNationalityAndState() {
    const requests: any[] = [];
    let nationalityIndex = -1;
    let stateIndex = -1;
    
    if (this.user.nationality_id) {
      nationalityIndex = requests.length;
      requests.push(this.adminService.getACountry(this.user.nationality_id));
    }
    
    if (this.user.states_id) {
      stateIndex = requests.length;
      requests.push(this.adminService.getAState(this.user.states_id));
    }

    if (requests.length > 0) {
      forkJoin(requests).subscribe({
        next: (responses) => {
          this.loading = false;
          if (nationalityIndex >= 0 && responses[nationalityIndex]) {
            this.nationality = responses[nationalityIndex].data;
          }
          if (stateIndex >= 0 && responses[stateIndex]) {
            this.state = responses[stateIndex].data;
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Error fetching nationality/state: ', error.message);
        },
      });
    } else {
      this.loading = false;
    }
  }

  /**
   * Load clients data for the current realtor
   */
  loadClientsData(): void {
    this.realtorService.getRealtorClients().subscribe({
      next: (response) => {
        this.clientsData = response.data;
      },
      error: (error) => {
        console.error('Error loading clients data:', error);
        this.clientsData = [];
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
    this.router.navigate(['/main/user-management/view', row.id, row.name]);
  }

  viewUser(user: Person) { this.router.navigate(['/main/user-management/view', user.id, user.name]); }

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
