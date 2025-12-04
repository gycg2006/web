import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    // Verificar se há usuário salvo no localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        this.currentUserSubject.next(userData.user || userData);
      } catch (e) {
        // Fallback para formato antigo
        this.currentUserSubject.next(JSON.parse(savedUser));
      }
    }
  }

  login(matricula: string, senha: string): Observable<any> {
    return new Observable(observer => {
      this.apiService.login(matricula, senha).subscribe({
        next: (response) => {
          // response contém { user, token }
          localStorage.setItem('currentUser', JSON.stringify(response));
          this.currentUserSubject.next(response.user);
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  register(matricula: string, senha: string): Observable<any> {
    return new Observable(observer => {
      this.apiService.register(matricula, senha).subscribe({
        next: (response) => {
          // response contém { user, token }
          localStorage.setItem('currentUser', JSON.stringify(response));
          this.currentUserSubject.next(response.user);
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        return userData.token || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }
}

