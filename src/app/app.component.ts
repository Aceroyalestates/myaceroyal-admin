import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterEvent, RouterOutlet, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { ErrorModalComponent } from './shared/components/error-modal/error-modal.component';
import { LoaderService } from './core/services/loader.service';
import { Subscription, filter } from 'rxjs';
import { TopProgressComponent } from './shared/components/top-progress/top-progress.component';
import { ProgressService } from './core/services/progress.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SharedModule, ErrorModalComponent, TopProgressComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'My Aceroyal Admin';
  private routeSub = new Subscription();
  // Using custom loader component; no local state needed

  constructor(private router: Router, private loader: LoaderService, private progress: ProgressService) {}

  ngOnInit(): void {
    // Show a global loader during route transitions for better UX
    this.routeSub = this.router.events
      .pipe(filter((e: any): e is RouterEvent => !!e))
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          // Drive top progress bar for route nav
          this.progress.start();
        }
        if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
          // Defer completion to HTTP interceptor if requests fire; otherwise finish quickly
          setTimeout(() => {
            const snap = this.progress.getSnapshot();
            if (snap.visible && snap.value < 20) {
              this.progress.complete();
            }
          }, 300);
        }
      });

  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
    // nothing else
  }
}
