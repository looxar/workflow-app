import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Role, UserProfile } from '../../auth/models/logged-in-user';
import { UserService } from '../../services/user.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [RouterLink, CommonModule], // Add CommonModule here
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  users: UserProfile[] = [];
  bsModalRef?: BsModalRef;

  constructor(
    private userService: UserService,
    private modalService: BsModalService, // If using modals
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        // Filter the users to only include those with role USER or ADMIN
        this.users = users.filter((user) => user.role === Role.USER || user.role === Role.ADMIN);
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  // Method to check if the logged-in user has the MANAGER role
  isManager(): boolean {
    const loggedInUser = this.authService.loggedInUser;
    return loggedInUser?.userProfile.role === Role.MANAGER;
  }

  onConfirm(user: UserProfile): void {
    const confirmed = window.confirm(`Are you sure you want to delete user ${user.username}?`);
    if (confirmed) {
      this.deleteUser(user.id);
    }
  }

  deleteUser(userId: number): void {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        alert('User deleted successfully');
        this.fetchUsers(); // Refresh the user list after deletion
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      }
    });
  }
}
