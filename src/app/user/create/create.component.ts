import { Component } from '@angular/core';
import { Role } from '../../auth/models/logged-in-user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  createUserForm: FormGroup;

  // Only include USER and ADMIN roles in the dropdown
  roles = [Role.USER, Role.ADMIN];

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.createUserForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.createUserForm.valid) {
      const newUserProfile = this.createUserForm.value;
      this.userService.createUser(newUserProfile).subscribe({
        next: (response) => {
          console.log('User created successfully:', response);
          alert('User created successfully!');
          this.router.navigate(['/user/list']); // Redirect to user list
        },
        error: (error) => {
          console.error('Error creating user:', error);
          alert('Failed to create user. Please try again.');
        }
      });
    }
  }
}
