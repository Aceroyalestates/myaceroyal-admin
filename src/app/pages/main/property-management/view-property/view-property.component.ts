import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { Property } from 'src/app/core/models/properties';
import { PropertyService } from 'src/app/core/services/property.service';

@Component({
  selector: 'app-view-property',
  imports: [CommonModule, SharedModule, NzCollapseModule],
  templateUrl: './view-property.component.html',
  styleUrl: './view-property.component.css'
})
export class ViewPropertyComponent {
id: string = '';
// properties: Property[] = Properties;
property: Property | null = null;

panels = [
    {
      active: true,
      name: '2-Bedroom',
      arrow: true
    },
    {
      active: false,
      arrow: true,
      name: '1-Bedroom',
    }
  ];

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private propertyService: PropertyService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log('Query Params:', params);
    });
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id') || '';
      console.log('Route ID:', this.id); 
      this.propertyService.getPropertyById(this.id).subscribe(property => {
        this.property = property;
        console.log('Fetched property:', this.property);
        this.property = property;
      });
      console.log({property: this.property})
      if (!this.property) {
        console.warn('Property not found for ID:', this.id);
      }
    });
  }

  gotoEdit() {
    this.router.navigateByUrl(`property-management/edit/${this.id}`);
  }
}
