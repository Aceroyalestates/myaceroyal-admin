import { Component } from '@angular/core';

import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { SharedModule } from '../../shared/shared.module';
import { ErrorModalComponent } from 'src/app/shared/components/error-modal/error-modal.component';
import { LoaderComponent } from 'src/app/shared/components/loader/loader.component';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ThemeService } from 'src/app/core/services/theme.service';

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
  theme: 'light' | 'dark' = 'light';

  constructor(private authService: AuthService, private themeService: ThemeService) {
    this.theme = this.themeService.getTheme();
    this.themeService.initTheme();
  }

  toggleTheme() {
    this.theme = this.themeService.toggleTheme();
  }

  onSearch(query: string) {
    console.log('Search query:', query);
    // filter table, trigger API search, etc.
  }

  logout(){
    this.authService.logout();
  }
}
