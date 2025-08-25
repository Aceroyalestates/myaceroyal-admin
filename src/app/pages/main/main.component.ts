import { Component } from '@angular/core';

import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { SharedModule } from '../../shared/shared.module';
import { ErrorModalComponent } from 'src/app/shared/components/error-modal/error-modal.component';
import { LoaderComponent } from 'src/app/shared/components/loader/loader.component';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    SharedModule,
    NzMenuModule,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {
  isCollapsed = false;

  constructor(private authService: AuthService){}

    onSearch(query: string) {
    console.log('Search query:', query);
    // filter table, trigger API search, etc.
  }

  logout(){
    this.authService.logout();
  }
}
