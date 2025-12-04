import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Book, GoogleBooksResponse } from '../models/book.model';
import { MOCK_BOOK, MOCK_BOOKS } from './mocks/book-data'; // Caminho correto

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'https://www.googleapis.com/books/v1/volumes';

  constructor(private http: HttpClient) { }

  searchBooks(query: string): Observable<GoogleBooksResponse> {
    const params = `?q=${query}&maxResults=20&orderBy=newest&langRestrict=pt&printType=books`;
    return this.http.get<GoogleBooksResponse>(`${this.apiUrl}${params}`)
      .pipe(
        catchError(error => {
          console.error('Erro na API, usando Mock', error);
          return of(MOCK_BOOKS);
        })
      );
  }

  getBookById(id: string): Observable<Book> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Book>(url)
      .pipe(
        catchError(error => {
          console.error(`Erro no ID ${id}, usando Mock`, error);
          return of(MOCK_BOOK);
        })
      );
  }
}