import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../core/services/book';
import { Book } from '../../core/models/book.model';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [CommonModule, Navbar, RouterModule, FormsModule],
  templateUrl: './lists.html',
  styleUrls: ['./lists.css']
})
export class Lists {
  
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
  rotationAngle = 0; // Controle de rotação da imagem
  titleTouched = false; // Controle de validação do título

  // Busca de Livros
  searchQuery = '';
  searchResults: Book[] = [];
  isSearching = false;

  // Simulação de Banco de Dados
  myLists = [
    {
      title: 'Bibliografia TCC 🎓',
      description: 'Livros e artigos essenciais para a monografia.',
      count: 2,
      cover: 'https://books.google.com/books/content?id=K0KHCwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      books: [
        { id: '1', title: 'Metodologia Científica', author: 'Marina Andrade', cover: 'https://books.google.com/books/content?id=K0KHCwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
        { id: '2', title: 'Como escrever um TCC', author: 'André Fontenelle', cover: 'https://books.google.com/books/content?id=mn6XEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' }
      ]
    },
    {
      title: 'Clube do Livro 2024 📚',
      description: 'Leituras mensais combinadas com a galera.',
      count: 1,
      cover: 'https://books.google.com/books/content?id=mn6XEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      books: [
        { id: '3', title: 'O Hobbit', author: 'J.R.R. Tolkien', cover: 'https://books.google.com/books/content?id=mn6XEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' }
      ]
    },
    {
      title: 'Favoritos da Vida ❤️',
      description: 'Aqueles que eu releria mil vezes.',
      count: 0,
      cover: 'assets/no-cover.png',
      books: [] as any[]
    }
  ];

  constructor(private bookService: BookService) {}

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
    if (!this.newList.title.trim()) return;

    // Em uma implementação real, você enviaria a imagem rotacionada para o servidor.
    // Aqui, apenas usamos o previewCover como a imagem da capa.
    
    this.myLists.unshift({
      title: this.newList.title,
      description: this.newList.description,
      count: 0,
      cover: (this.previewCover as string) || this.newList.cover,
      books: []
    });

    this.closeCreateModal();
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
    if (confirm('Tem certeza que deseja remover este livro da lista?')) {
      this.myLists[listIndex].books.splice(bookIndex, 1);
      this.myLists[listIndex].count--;
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
        alert('Erro ao buscar livros.');
      }
    });
  }

  addBookToList(book: Book) {
    if (this.currentListIndexForAdd !== null) {
      const list = this.myLists[this.currentListIndexForAdd];
      
      const exists = list.books.some(b => b.id === book.id);
      if (exists) {
        alert('Este livro já está na lista!');
        return;
      }

      list.books.push({
        id: book.id,
        title: book.volumeInfo.title,
        author: book.volumeInfo.authors?.join(', ') || 'Autor Desconhecido',
        cover: book.volumeInfo.imageLinks?.thumbnail || 'assets/no-cover.png'
      });
      list.count++;
      
      this.closeAddBookModal();
    }
  }
}