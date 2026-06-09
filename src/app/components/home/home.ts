import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { TodoService, TodoTask } from '../../services/todo.service';

@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly todoService = inject(TodoService);

  tasks: TodoTask[] = [];
  filteredTasks: TodoTask[] = [];
  
  newTitle = '';
  newDescription = '';
  
  editingTask: TodoTask | null = null;
  editTitle = '';
  editDescription = '';
  
  filter = 'all';

  errorMessage = '';
  isLoading = false;

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.isLoading = true;
    this.errorMessage = '';
    this.todoService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load tasks.';
        this.isLoading = false;
      }
    });
  }

  addTask() {
    if (!this.newTitle.trim()) {
      this.errorMessage = 'Task title is required.';
      return;
    }

    this.todoService.createTask(this.newTitle, this.newDescription).subscribe({
      next: (newTask) => {
        this.tasks.push(newTask);
        this.newTitle = '';
        this.newDescription = '';
        this.applyFilter();
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to create task.';
      }
    });
  }

  toggleTaskCompletion(task: TodoTask) {
    const updatedStatus = !task.isCompleted;
    this.todoService.updateTask(task.id, task.title, task.description, updatedStatus).subscribe({
      next: (updatedTask) => {
        task.isCompleted = updatedTask.isCompleted;
        this.applyFilter();
      },
      error: () => {
        this.errorMessage = 'Failed to update task status.';
      }
    });
  }

  startEdit(task: TodoTask) {
    this.editingTask = task;
    this.editTitle = task.title;
    this.editDescription = task.description;
  }

  cancelEdit() {
    this.editingTask = null;
  }

  saveEdit() {
    if (!this.editingTask) return;
    if (!this.editTitle.trim()) {
      this.errorMessage = 'Task title cannot be empty.';
      return;
    }

    this.todoService.updateTask(this.editingTask.id, this.editTitle, this.editDescription, this.editingTask.isCompleted).subscribe({
      next: (updatedTask) => {
        const index = this.tasks.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
        this.editingTask = null;
        this.applyFilter();
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Failed to save task edits.';
      }
    });
  }

  deleteTask(id: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.todoService.deleteTask(id).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(t => t.id !== id);
          this.applyFilter();
        },
        error: () => {
          this.errorMessage = 'Failed to delete task.';
        }
      });
    }
  }

  setFilter(newFilter: string) {
    this.filter = newFilter;
    this.applyFilter();
  }

  applyFilter() {
    if (this.filter === 'active') {
      this.filteredTasks = this.tasks.filter(t => !t.isCompleted);
    } else if (this.filter === 'completed') {
      this.filteredTasks = this.tasks.filter(t => t.isCompleted);
    } else {
      this.filteredTasks = [...this.tasks];
    }
  }

  logout() {
    this.authService.logout();
  }
}
