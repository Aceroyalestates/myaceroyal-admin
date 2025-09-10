import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterEvent, RouterOutlet, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { ErrorModalComponent } from './shared/components/error-modal/error-modal.component';
import { LoaderService } from './core/services/loader.service';
import { Subscription, filter } from 'rxjs';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SharedModule, NzSpinModule, ErrorModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'My Aceroyal Admin';
  private routeSub = new Subscription();
  private loaderSub = new Subscription();
  spinning = false;
  spinTip = '';

  constructor(private router: Router, private loader: LoaderService) {}

  ngOnInit(): void {
    // Show a global loader during route transitions for better UX
    this.routeSub = this.router.events
      .pipe(filter((e: any): e is RouterEvent => !!e))
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.loader.show('Loading view...');
        }
        if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
          this.loader.hide();
        }
      });

    // Bind loader state to nz-spin
    this.loaderSub = this.loader.loaderState$.subscribe(state => {
      this.spinning = state.isLoading;
      this.spinTip = state.message || '';
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
    this.loaderSub.unsubscribe();
  }
}
