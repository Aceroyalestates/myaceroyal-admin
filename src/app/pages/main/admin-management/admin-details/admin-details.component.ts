import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, signal } from '@angular/core';
import {
  TableColumn,
  TableAction,
} from 'src/app/shared/components/table/table.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Metrics, PAGE_SIZE, People } from 'src/app/core/constants';
import { Person } from 'src/app/core/types/general';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/core/models/users';
import { AdminService } from 'src/app/core/services/admin.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { forkJoin } from 'rxjs';
import { Activity, Role } from 'src/app/core/models/generic';

@Component({
  selector: 'app-admin-details',
  imports: [CommonModule, SharedModule, NzSelectModule],
  templateUrl: './admin-details.component.html',
  styleUrl: './admin-details.component.css',
})
export class AdminDetailsComponent implements OnInit {
  userMetrics = Metrics;
  loading = false;
  error: string | null = null;

  lucy!: string;
  role!: string;
  roles: Role[] = [];
  people: Person[] = People;
  id: string = '';
  user!: User;
  activities!: Activity[];

  columns: TableColumn[] = [
    {
      key: 'activity',
      title: 'Activity',
      sortable: false,
      type: 'text',
    },
    {
      key: 'date',
      title: 'Date',
      sortable: true,
      type: 'text',
    },
   
  ];


  selectedPeople = signal<Activity[]>([]);

  constructor(
    private activatedRoute: ActivatedRoute,
    private adminService: AdminService,
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.activatedRoute.params.subscribe({
      next: (param) => (this.id = param['id']),
    });
    this.getUser(this.id);
  }

  getUser(id: string) {
    this.loading = true;
    forkJoin([
      this.adminService.getUserById(id),
      this.dashboardService.getActivityLogs(1, PAGE_SIZE, {}),
      this.adminService.getRoles(),
    ]).subscribe({
      next: ([user, activities, roles]) => {
        this.loading = false;
        this.user = user;
        this.activities = activities.data.map((activity) => ({
          ...activity,
          activity: activity.action + " - "+ activity.description,
          date: new Date(activity.createdAt).toLocaleDateString(),
          // is_active: user.is_active === true ? 'Active' : 'Inactive',
        }));
        this.roles = roles.data;
      },
      error: (error) => {
        this.loading = false;
        console.error('An error occured: ', error.message);
      },
    });
  }

  suspendAdmin() {
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

  onSelectionChange(selected: Activity[]) {
    this.selectedPeople.set(selected);
    console.log('Selected people:', this.selectedPeople());
  }


  handleSelectedData(selected: Activity[]) {
    this.selectedPeople.set(selected);
    console.log(this.selectedPeople);
  }
}
