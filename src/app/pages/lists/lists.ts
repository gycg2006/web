import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../core/services/book';
import { Book } from '../../core/models/book.model';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [CommonModule, Navbar, RouterModule, FormsModule],
  templateUrl: './lists.html',
  styleUrls: ['./lists.css']
})
export class Lists implements OnInit {
  
  // Controle de Modais
  isCreateModalOpen = false;
  isAddBookModalOpen = false;
  
  expandedListIndex: number | null = null;
  currentListIndexForAdd: number | null = null;

  // Dados para Nova Lista / Edição
  newList = {
    title: '',
    description: '',
    cover: 'assets/no-cover.png'
  };
  previewCover: string | ArrayBuffer | null = null;
  rotationAngle = 0;
  titleTouched = false;

  // Busca de Livros
  searchQuery = '';
  searchResults: Book[] = [];
  isSearching = false;

  // Listas do usuário
  myLists: any[] = [];
  isLoading = false;
  currentUser: any = null;

  constructor(
    private bookService: BookService,
    private apiService: ApiService,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit() {
    this.loadLists();
  }

  loadLists() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      this.toastService.warning('Usuário não autenticado');
      return;
    }

    this.isLoading = true;
    this.apiService.getUserBookLists(currentUser.id).subscribe({
      next: (lists) => {
        this.myLists = lists.map((list: any) => ({
          id: list.id,
          title: list.title,
          description: list.description,
          cover: list.coverImage || 'assets/no-cover.png',
          count: list.bookCount || 0,
          books: (list.books || []).map((book: any) => ({
            id: book.googleBooksId,
            title: book.title,
            author: (book.authors || []).join(', ') || 'Autor Desconhecido',
            cover: book.thumbnailUrl || 'assets/no-cover.png'
          }))
        }));
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.toastService.error('Erro ao carregar listas');
        console.error('Erro ao carregar listas:', error);
      }
    });
  }

  // --- AÇÕES DO MODAL DE CRIAÇÃO (CREATE) ---
  openCreateModal() {
    this.isCreateModalOpen = true;
    this.newList = { title: '', description: '', cover: 'assets/no-cover.png' };
    this.previewCover = null;
    this.rotationAngle = 0; // Resetar rotação
    this.titleTouched = false; // Resetar validação
  }

  closeCreateModal() {
    this.isCreateModalOpen = false;
  }

  onCoverSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewCover = e.target?.result || null;
        this.rotationAngle = 0; // Resetar rotação ao selecionar nova imagem
      };
      reader.readAsDataURL(file);
    }
  }

  rotateCover(deg: number) {
    this.rotationAngle += deg;
  }

  removeCover() {
    this.previewCover = null;
    this.rotationAngle = 0;
    // Resetar o input file se necessário (opcional, requer ViewChild)
  }

  createList() {
    if (!this.newList.title.trim()) {
      this.toastService.warning('O título da lista é obrigatório');
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      this.toastService.error('Usuário não autenticado');
      return;
    }

    const listData = {
      title: this.newList.title,
      description: this.newList.description,
      coverImage: (this.previewCover as string) || null
    };

    this.apiService.createBookList(currentUser.id, listData).subscribe({
      next: (newList) => {
        this.toastService.success('Lista criada com sucesso!');
        this.closeCreateModal();
        this.loadLists(); // Recarregar listas
      },
      error: (error) => {
        const errorMessage = error.error?.error || 'Erro ao criar lista';
        this.toastService.error(errorMessage);
      }
    });
  }

  // --- AÇÕES DA LISTA (READ / UPDATE / DELETE) ---
  toggleList(index: number) {
    if (this.expandedListIndex === index) {
      this.expandedListIndex = null;
    } else {
      this.expandedListIndex = index;
    }
  }

  removeBook(listIndex: number, bookIndex: number, event: Event) {
    event.stopPropagation();
    const list = this.myLists[listIndex];
    const book = list.books[bookIndex];
    
    if (confirm('Tem certeza que deseja remover este livro da lista?')) {
      this.apiService.removeBookFromList(list.id, book.id).subscribe({
        next: () => {
          this.toastService.success('Livro removido da lista');
          this.loadLists();
        },
        error: () => {
          this.toastService.error('Erro ao remover livro da lista');
        }
      });
    }
  }

  // --- MODAL DE ADICIONAR LIVRO (BUSCA) ---
  openAddBookModal(listIndex: number, event: Event) {
    event.stopPropagation();
    this.currentListIndexForAdd = listIndex;
    this.isAddBookModalOpen = true;
    this.searchQuery = '';
    this.searchResults = [];
  }

  closeAddBookModal() {
    this.isAddBookModalOpen = false;
    this.currentListIndexForAdd = null;
  }

  searchBooks() {
    if (!this.searchQuery.trim()) return;
    
    this.isSearching = true;
    this.bookService.searchBooks(this.searchQuery).subscribe({
      next: (res) => {
        this.searchResults = res.items || [];
        this.isSearching = false;
      },
      error: () => {
        this.isSearching = false;
        this.toastService.error('Erro ao buscar livros');
      }
    });
  }

  addBookToList(book: Book) {
    if (this.currentListIndexForAdd === null) return;
    
    const list = this.myLists[this.currentListIndexForAdd];
    
    const exists = list.books.some((b: any) => b.id === book.id);
    if (exists) {
      this.toastService.warning('Este livro já está na lista!');
      return;
    }

    this.apiService.addBookToList(list.id, book).subscribe({
      next: () => {
        this.toastService.success('Livro adicionado à lista!');
        this.closeAddBookModal();
        this.loadLists();
      },
      error: (error) => {
        const errorMessage = error.error?.error || 'Erro ao adicionar livro à lista';
        this.toastService.error(errorMessage);
      }
    });
  }

  deleteList(listIndex: number, event: Event) {
    event.stopPropagation();
    const list = this.myLists[listIndex];
    
    if (!confirm(`Tem certeza que deseja deletar a lista "${list.title}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    this.apiService.deleteBookList(list.id).subscribe({
      next: () => {
        this.toastService.success('Lista deletada com sucesso!');
        this.loadLists();
        if (this.expandedListIndex === listIndex) {
          this.expandedListIndex = null;
        }
      },
      error: () => {
        this.toastService.error('Erro ao deletar lista');
      }
    });
  }
}