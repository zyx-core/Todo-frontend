import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly currentUser = signal<User | null>(null);

  constructor() {
    const savedUser = localStorage.getItem('todo_user');
    const token = localStorage.getItem('todo_token');
    if (savedUser && token) {
      try {
        this.currentUser.set(JSON.parse(savedUser));
      } catch {
        this.logout();
      }
    }
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post('/api/auth/signup', { name, email, password });
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/signin', { email, password }).pipe(
      tap(response => {
        localStorage.setItem('todo_token', response.token);
        localStorage.setItem('todo_user', JSON.stringify(response.user));
        this.currentUser.set(response.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('todo_token');
    localStorage.removeItem('todo_user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('todo_token') !== null;
  }

  getToken(): string | null {
    return localStorage.getItem('todo_token');
  }
}
