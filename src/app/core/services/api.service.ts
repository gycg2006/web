import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl || 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    const headers: any = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return new HttpHeaders(headers);
  }

  private getToken(): string | null {
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

  // User endpoints
  login(matricula: string, senha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/login`, { matricula, senha }, {
      headers: this.getHeaders()
    });
  }

  register(matricula: string, senha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, { matricula, senha }, {
      headers: this.getHeaders()
    });
  }

  getUser(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${userId}`, {
      headers: this.getHeaders()
    });
  }

  updateUser(userId: number, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}`, userData, {
      headers: this.getHeaders()
    });
  }

  // User Books endpoints
  addBookToUser(userId: number, book: any, status: string = 'QUERO_LER'): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/${userId}/books`, { ...book, status }, {
      headers: this.getHeaders()
    });
  }

  getUserBooks(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/${userId}/books`, {
      headers: this.getHeaders()
    });
  }

  getUserBooksByStatus(userId: number, status: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/${userId}/books/status/${status}`, {
      headers: this.getHeaders()
    });
  }

  updateBookStatus(userId: number, bookId: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}/books/${bookId}/status`, { status }, {
      headers: this.getHeaders()
    });
  }

  removeBookFromUser(userId: number, bookId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}/books/${bookId}`, {
      headers: this.getHeaders()
    });
  }

  updateBookReview(userId: number, bookId: string, rating: number | null, review: string | null): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}/books/${bookId}/review`, { rating, review }, {
      headers: this.getHeaders()
    });
  }

  // Book Lists endpoints
  createBookList(userId: number, listData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/${userId}/lists`, listData, {
      headers: this.getHeaders()
    });
  }

  getUserBookLists(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/${userId}/lists`, {
      headers: this.getHeaders()
    });
  }

  getBookList(listId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/1/lists/${listId}`, {
      headers: this.getHeaders()
    });
  }

  updateBookList(listId: number, listData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/1/lists/${listId}`, listData, {
      headers: this.getHeaders()
    });
  }

  deleteBookList(listId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/1/lists/${listId}`, {
      headers: this.getHeaders()
    });
  }

  addBookToList(listId: number, book: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/1/lists/${listId}/books`, book, {
      headers: this.getHeaders()
    });
  }

  removeBookFromList(listId: number, bookId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/1/lists/${listId}/books/${bookId}`, {
      headers: this.getHeaders()
    });
  }
}

