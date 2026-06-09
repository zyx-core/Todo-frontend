import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TodoTask {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly http = inject(HttpClient);

  getTasks(): Observable<TodoTask[]> {
    return this.http.get<TodoTask[]>('/api/tasks');
  }

  createTask(title: string, description: string): Observable<TodoTask> {
    return this.http.post<TodoTask>('/api/tasks', { title, description });
  }

  updateTask(id: number, title: string, description: string, isCompleted: boolean): Observable<TodoTask> {
    return this.http.put<TodoTask>(`/api/tasks/${id}`, { title, description, isCompleted });
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`/api/tasks/${id}`);
  }
}
