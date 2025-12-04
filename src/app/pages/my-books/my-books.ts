import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { BookService } from '../../core/services/book';
import { Book } from '../../core/models/book.model';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-my-books',
  standalone: true,
  imports: [CommonModule, Navbar, RouterModule],
  templateUrl: './my-books.html',
  styleUrls: ['./my-books.css']
})
export class MyBooks implements OnInit {
  // Prateleiras
  reading: Book[] = [];   // Lendo agora
  read: Book[] = [];      // Já li
  wantToRead: Book[] = []; // Quero ler (Wishlist)

  activeTab: 'lendo' | 'lidos' | 'quero-ler' = 'lendo';
  isLoading: boolean = false;

  constructor(
    private bookService: BookService,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.carregarEstante();
  }

  carregarEstante() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      console.error('Usuário não autenticado');
      return;
    }

    this.isLoading = true;
    const userId = currentUser.id;

    // Carregar livros da API
    this.apiService.getUserBooksByStatus(userId, 'LENDO').subscribe({
      next: (userBooks) => {
        this.reading = userBooks.map(ub => this.convertUserBookToBook(ub));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar livros lendo:', error);
        this.isLoading = false;
      }
    });

    this.apiService.getUserBooksByStatus(userId, 'LIDO').subscribe({
      next: (userBooks) => {
        this.read = userBooks.map(ub => this.convertUserBookToBook(ub));
      },
      error: (error) => {
        console.error('Erro ao carregar livros lidos:', error);
      }
    });

    this.apiService.getUserBooksByStatus(userId, 'QUERO_LER').subscribe({
      next: (userBooks) => {
        this.wantToRead = userBooks.map(ub => this.convertUserBookToBook(ub));
      },
      error: (error) => {
        console.error('Erro ao carregar livros desejados:', error);
      }
    });
  }

  private convertUserBookToBook(userBook: any): Book {
    const bookDTO = userBook.book;
    return {
      id: bookDTO.googleBooksId,
      volumeInfo: {
        title: bookDTO.title,
        authors: bookDTO.authors || [],
        publisher: bookDTO.publisher,
        publishedDate: bookDTO.publishedDate,
        description: bookDTO.description,
        pageCount: bookDTO.pageCount,
        categories: bookDTO.categories || [],
        averageRating: bookDTO.averageRating,
        ratingsCount: bookDTO.ratingsCount,
        imageLinks: {
          thumbnail: bookDTO.thumbnailUrl || '',
          smallThumbnail: bookDTO.smallThumbnailUrl || ''
        },
        previewLink: bookDTO.previewLink,
        infoLink: bookDTO.infoLink
      }
    };
  }

  setTab(tab: 'lendo' | 'lidos' | 'quero-ler') {
    this.activeTab = tab;
  }
}