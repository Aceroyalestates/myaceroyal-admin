import { Component } from '@angular/core';
import { trigger, transition, style, animate, query, group } from '@angular/animations';

import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { SharedModule } from '../../shared/shared.module';
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
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        query(':enter, :leave', [
          style({ position: 'absolute', width: '100%' })
        ], { optional: true }),
        group([
          query(':leave', [
            style({ opacity: 1, transform: 'translateY(0px)' }),
            animate('220ms ease', style({ opacity: 0, transform: 'translateY(6px)' }))
          ], { optional: true }),
          query(':enter', [
            style({ opacity: 0, transform: 'translateY(-6px)' }),
            animate('260ms 60ms ease', style({ opacity: 1, transform: 'translateY(0px)' }))
          ], { optional: true })
        ])
      ])
    ])
  ]
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

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
