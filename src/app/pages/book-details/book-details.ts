import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { BookService } from '../../core/services/book';
import { Book } from '../../core/models/book.model';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, Navbar, FormsModule, RouterModule],
  templateUrl: './book-details.html',
  styleUrls: ['./book-details.css']
})
export class BookDetails implements OnInit {
  book: Book | null = null;
  loading = true;
  
  // Avaliação
  userRating = 0;
  userReview = '';
  hoverRating = 0;
  
  // Status do livro na estante
  bookStatus: 'QUERO_LER' | 'LENDO' | 'LIDO' | null = null;
  isInShelf = false;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    // Usar subscribe para detectar mudanças na rota
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      
      if (id) {
        this.loading = true;
        this.book = null;
        
        this.bookService.getBookById(id).subscribe({
          next: (res) => {
            console.log('Resposta do Google Books:', res);
            // A resposta do Google Books já vem no formato correto
            this.book = res;
            this.loading = false;
            this.checkBookInShelf();
          },
          error: (err) => {
            console.error('Erro ao buscar livro:', err);
            this.loading = false;
            this.toastService.error('Não foi possível carregar o livro. Tente novamente.');
            // Redirecionar para home após 2 segundos
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 2000);
          }
        });
      } else {
        this.loading = false;
        this.toastService.error('ID do livro não encontrado');
        this.router.navigate(['/home']);
      }
    });
  }

  checkBookInShelf() {
    if (!this.book) return;
    
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) return;

    this.apiService.getUserBooks(currentUser.id).subscribe({
      next: (userBooks) => {
        const userBook = userBooks.find((ub: any) => ub.book?.googleBooksId === this.book?.id);
        if (userBook) {
          this.isInShelf = true;
          this.bookStatus = userBook.status;
          this.userRating = userBook.rating || 0;
          this.userReview = userBook.review || '';
        }
      },
      error: () => {
        // Silencioso - não é crítico
      }
    });
  }

  // Lógica das Estrelas
  setRating(star: number) {
    this.userRating = star;
  }

  addToShelf(status: 'QUERO_LER' | 'LENDO' | 'LIDO') {
    if (!this.book) return;

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      this.toastService.error('Usuário não autenticado');
      return;
    }

    this.apiService.addBookToUser(currentUser.id, this.book, status).subscribe({
      next: () => {
        this.toastService.success(`Livro adicionado à sua estante como "${this.getStatusLabel(status)}"`);
        this.isInShelf = true;
        this.bookStatus = status;
        this.checkBookInShelf();
      },
      error: (error) => {
        const errorMessage = error.error?.error || 'Erro ao adicionar livro à estante';
        this.toastService.error(errorMessage);
      }
    });
  }

  updateBookStatus(status: 'QUERO_LER' | 'LENDO' | 'LIDO') {
    if (!this.book || !this.isInShelf) return;

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) return;

    this.apiService.updateBookStatus(currentUser.id, this.book.id, status).subscribe({
      next: () => {
        this.toastService.success(`Status atualizado para "${this.getStatusLabel(status)}"`);
        this.bookStatus = status;
      },
      error: () => {
        this.toastService.error('Erro ao atualizar status do livro');
      }
    });
  }

  saveReview() {
    if (this.userRating === 0) {
      this.toastService.warning('Por favor, dê uma nota de 1 a 5 estrelas!');
      return;
    }

    if (!this.book) return;

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      this.toastService.error('Usuário não autenticado');
      return;
    }

    this.apiService.updateBookReview(currentUser.id, this.book.id, this.userRating, this.userReview).subscribe({
      next: () => {
        this.toastService.success('Resenha salva com sucesso!');
      },
      error: () => {
        this.toastService.error('Erro ao salvar resenha');
      }
    });
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'QUERO_LER': 'Quero Ler',
      'LENDO': 'Lendo',
      'LIDO': 'Lido'
    };
    return labels[status] || status;
  }
}