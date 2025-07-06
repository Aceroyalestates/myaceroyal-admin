import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
// import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-unauthorized',
    // imports: [RouterLink],
    templateUrl: './unauthorized.component.html',
    styleUrl: './unauthorized.component.scss'
})
export class UnauthorizedComponent {
  // constructor(private auth: AuthService, private router: Router) {}

  // redirectTologOut() {
  //   this.auth.logout();
  // }
  redirectToDashboard() {
    // this.router.navigateByUrl('');
  }
}
