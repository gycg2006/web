import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { BookService } from '../../core/services/book';
import { Book } from '../../core/models/book.model';
import { RouterModule } from '@angular/router';

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

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.carregarEstante();
  }

  carregarEstante() {
    // Simulando dados do banco: buscamos livros reais para popular as listas
    
    // 1. Lendo Agora (Ex: Livros técnicos atuais)
    this.bookService.searchBooks('angular development').subscribe(res => {
      this.reading = (res.items || []).slice(0, 2); // Pega 2 livros
    });

    // 2. Lidos (Ex: Clássicos)
    this.bookService.searchBooks('machado de assis').subscribe(res => {
      this.read = (res.items || []).slice(0, 5); // Pega 5 livros
    });

    // 3. Quero Ler (Ex: Ficção)
    this.bookService.searchBooks('duna').subscribe(res => {
      this.wantToRead = (res.items || []).slice(0, 8); // Pega 8 livros
    });
  }

  setTab(tab: 'lendo' | 'lidos' | 'quero-ler') {
    this.activeTab = tab;
  }
}