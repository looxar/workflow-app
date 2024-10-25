import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProfile } from '../auth/models/logged-in-user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  createUser(userData: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.post<UserProfile>(this.apiUrl, userData);
  }

  // Method to fetch all users
  getUsers(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(this.apiUrl);
  }

  // Method to delete a user
  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }
}
