import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; // Para pegar o ID da URL
import { Navbar } from '../../components/navbar/navbar';
import { BookService } from '../../core/services/book';
import { Book } from '../../core/models/book.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, Navbar, FormsModule],
  templateUrl: './book-details.html',
  styleUrls: ['./book-details.css']
})
export class BookDetails implements OnInit {
  book: Book | null = null;
  loading = true;
  
  // Avaliação
  userRating = 0;
  userReview = '';
  hoverRating = 0; // Para o efeito visual das estrelas

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit() {
    // 1. Pega o ID da URL
    const id = this.route.snapshot.paramMap.get('id');
    console.log('ID capturado da URL:', id); // <--- DEBUG 1

    if (id) {
      this.bookService.getBookById(id).subscribe({
        next: (res) => {
          console.log('Livro encontrado:', res); // <--- DEBUG 2
          this.book = res;
          this.loading = false; // <--- OBRIGATÓRIO: Desligar o loading
        },
        error: (err) => {
          console.error('Erro ao buscar livro:', err); // <--- DEBUG 3
          this.loading = false; // <--- OBRIGATÓRIO: Desligar mesmo com erro
          alert('Não foi possível carregar o livro. Tente novamente.');
        }
      });
    } else {
      console.error('Nenhum ID foi encontrado na rota!');
      this.loading = false;
    }
  }

  // Lógica das Estrelas
  setRating(star: number) {
    this.userRating = star;
  }

  // Salvar Resenha (Simulação)
  saveReview() {
    if (this.userRating === 0) {
      alert('Por favor, dê uma nota de 1 a 5 estrelas!');
      return;
    }
    
    console.log('Livro:', this.book?.volumeInfo.title);
    console.log('Nota:', this.userRating);
    console.log('Resenha:', this.userReview);
    
    alert('Resenha salva com sucesso! (Simulação)');
    this.router.navigate(['/home']);
  }
}