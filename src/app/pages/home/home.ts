import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // <--- IMPORTANTE: Adicione isso
import { Navbar } from '../../components/navbar/navbar';
import { BookService } from '../../core/services/book';
import { Book } from '../../core/models/book.model';

@Component({
  selector: 'app-home',
  standalone: true,
  // Adicione RouterModule na lista de imports abaixo 👇
  imports: [CommonModule, Navbar, RouterModule], 
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  // Feed Principal
  books: Book[] = [];
  
  // Categorias do Leia-me
  booksTI: Book[] = [];
  booksSaude: Book[] = [];
  booksDireito: Book[] = [];
  booksFiccao: Book[] = [];
  booksRomance: Book[] = [];
  booksHistoria: Book[] = [];

  // Controle de Abas
  activeTab: 'feed' | 'catalogo' = 'feed';

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.carregarFeed();
    this.carregarCatalogo();
  }

  carregarFeed() {
    this.bookService.searchBooks('tecnologia').subscribe({
      next: (res) => this.books = res.items || [],
      error: (err) => console.error('Erro no feed:', err)
    });
  }

  carregarCatalogo() {
    this.bookService.searchBooks('computação').subscribe(res => this.booksTI = res.items || []);
    this.bookService.searchBooks('medicina').subscribe(res => this.booksSaude = res.items || []);
    this.bookService.searchBooks('direito').subscribe(res => this.booksDireito = res.items || []);
    this.bookService.searchBooks('ficção científica').subscribe(res => this.booksFiccao = res.items || []);
    this.bookService.searchBooks('romance').subscribe(res => this.booksRomance = res.items || []);
    this.bookService.searchBooks('história do brasil').subscribe(res => this.booksHistoria = res.items || []);
  }

  setTab(tab: 'feed' | 'catalogo') {
    this.activeTab = tab;
  }

  scrollCarousel(categoryId: string, direction: number) {
    const container = document.getElementById(`carousel-${categoryId}`);
    
    if (container) {
      const scrollAmount = 300; 
      container.scrollBy({ 
        left: scrollAmount * direction, 
        behavior: 'smooth' 
      });
    }
  }
}