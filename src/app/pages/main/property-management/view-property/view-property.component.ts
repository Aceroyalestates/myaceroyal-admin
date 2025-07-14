import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Properties } from 'src/app/core/constants';
import { Property } from 'src/app/core/types/general';
import { SharedModule } from 'src/app/shared/shared.module';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';

@Component({
  selector: 'app-view-property',
  imports: [CommonModule, SharedModule, NzCollapseModule],
  templateUrl: './view-property.component.html',
  styleUrl: './view-property.component.css'
})
export class ViewPropertyComponent {
id: string | null = null;
properties: Property[] = Properties;
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

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      console.log('Route ID:', this.id); // For debugging
      this.property = this.properties.find(p => p.id === Number(this.id)) || null;
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
