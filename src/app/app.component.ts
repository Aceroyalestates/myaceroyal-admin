import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterEvent, RouterOutlet, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { ErrorModalComponent } from './shared/components/error-modal/error-modal.component';
import { LoaderService } from './core/services/loader.service';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SharedModule, LoaderComponent, ErrorModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'My Aceroyal Admin';
  private routeSub = new Subscription();

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
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }
}
