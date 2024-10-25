import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Role } from '../../auth/models/logged-in-user';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule], // Add CommonModule here
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  authService = inject(AuthService);

  menus = [
    { path: 'budget/item-entry', title: 'Entry' },
    { path: 'budget/item-approval', title: 'Approval', requiresAdmin: true }
  ];

  // Method to check if the user is logged in and has the ADMIN role
  isAdminOrManager(): boolean {
    const loggedInUser = this.authService.loggedInUser;
    return (
      loggedInUser?.userProfile.role === Role.ADMIN ||
      loggedInUser?.userProfile.role === Role.MANAGER
    );
  }

  // Method to check if the logged-in user has the MANAGER role
  isManager(): boolean {
    const loggedInUser = this.authService.loggedInUser;
    return loggedInUser?.userProfile.role === Role.MANAGER;
  }

  // add onLogout
  onLogout(): void {
    // Clear any stored tokens or user data from sessionStorage
    sessionStorage.clear();
    // Optionally, if you only want to remove specific keys, you can use:
    // sessionStorage.removeItem('yourKeyName');
    this.authService.logout();
  }

  onKeycloakLogin() {
    this.authService
      .getLoginOauth2RedirectUrl()
      .subscribe((v) => window.location.replace(v.redirectUrl));
  }
}
