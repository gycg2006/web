import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../components/navbar/navbar';
import { BookService } from '../../core/services/book';
import { Book } from '../../core/models/book.model';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Navbar, RouterModule, FormsModule], 
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  // Feed Principal - Posts
  posts: any[] = [];
  isLoadingPosts = false;
  
  // Livros populares (para sidebar)
  popularBooks: Book[] = [];
  
  // Categorias do Leia-me (todos os livros carregados)
  allBooksTI: Book[] = [];
  allBooksSaude: Book[] = [];
  allBooksDireito: Book[] = [];
  allBooksFiccao: Book[] = [];
  allBooksRomance: Book[] = [];
  allBooksHistoria: Book[] = [];
  
  // Livros filtrados (baseado no activeFilter)
  booksTI: Book[] = [];
  booksSaude: Book[] = [];
  booksDireito: Book[] = [];
  booksFiccao: Book[] = [];
  booksRomance: Book[] = [];
  booksHistoria: Book[] = [];

  // Controle de Abas
  activeTab: 'feed' | 'catalogo' = 'feed';

  // Filtro do catálogo (Leia-me)
  activeFilter: 'tudo' | 'academico' | 'literatura' | 'tccs' | 'artigos' = 'tudo';

  // Dados do usuário
  currentUser: any = null;

  // Criar post
  newPostContent = '';
  isCreatingPost = false;

  constructor(
    private bookService: BookService,
    private authService: AuthService,
    private apiService: ApiService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Usar observable para garantir que o usuário esteja disponível
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user && user.id && this.activeTab === 'feed') {
        this.carregarFeed();
      }
    });
    
    // Tentar carregar imediatamente também
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser && this.currentUser.id) {
      this.carregarFeed();
    }
    
    this.carregarCatalogo();
    this.carregarLivrosPopulares();
  }

  carregarLivrosPopulares() {
    this.bookService.searchBooks('tecnologia').subscribe({
      next: (res) => this.popularBooks = res.items || [],
      error: (err) => console.error('Erro ao carregar livros populares:', err)
    });
  }

  carregarFeed() {
    if (!this.currentUser || !this.currentUser.id) {
      return;
    }

    this.isLoadingPosts = true;
    this.apiService.getFeed(this.currentUser.id, 0, 20).subscribe({
      next: (response) => {
        // A resposta pode vir como Page ou array direto
        const postsArray = response.content || response || [];
        // Mapear isLiked para liked para compatibilidade
        this.posts = postsArray.map((post: any) => ({
          ...post,
          liked: post.isLiked !== undefined ? post.isLiked : post.liked
        }));
        this.isLoadingPosts = false;
        this.cdr.detectChanges(); // Forçar detecção de mudanças
      },
      error: (err) => {
        console.error('Erro ao carregar feed:', err);
        this.toastService.error('Erro ao carregar feed');
        this.isLoadingPosts = false;
        this.cdr.detectChanges(); // Forçar detecção de mudanças mesmo em erro
      }
    });
  }

  createPost() {
    if (!this.newPostContent.trim()) {
      this.toastService.warning('Digite algo para postar');
      return;
    }

    if (!this.currentUser || !this.currentUser.id) {
      this.toastService.error('Usuário não autenticado');
      return;
    }

    this.isCreatingPost = true;
    this.apiService.createPost(this.currentUser.id, this.newPostContent).subscribe({
      next: () => {
        this.toastService.success('Post criado com sucesso!');
        this.newPostContent = '';
        this.carregarFeed(); // Recarrega o feed
        this.isCreatingPost = false;
      },
      error: (error) => {
        const errorMessage = error.error?.error || 'Erro ao criar post';
        this.toastService.error(errorMessage);
        this.isCreatingPost = false;
      }
    });
  }

  likePost(post: any) {
    if (!this.currentUser || !this.currentUser.id) {
      this.toastService.error('Usuário não autenticado');
      return;
    }

    if (post.liked) {
      this.apiService.unlikePost(post.id, this.currentUser.id).subscribe({
        next: () => {
          post.liked = false;
          post.likeCount = (post.likeCount || 0) - 1;
        },
        error: () => this.toastService.error('Erro ao descurtir post')
      });
    } else {
      this.apiService.likePost(post.id, this.currentUser.id).subscribe({
        next: () => {
          post.liked = true;
          post.likeCount = (post.likeCount || 0) + 1;
        },
        error: () => this.toastService.error('Erro ao curtir post')
      });
    }
  }

  savePost(post: any) {
    // Implementar salvar post se necessário
    this.toastService.info('Funcionalidade de salvar post em desenvolvimento');
  }

  formatTime(dateString: string): string {
    if (!dateString) return 'agora';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'agora';
    if (diffMins < 60) return `há ${diffMins} min`;
    if (diffHours < 24) return `há ${diffHours}h`;
    if (diffDays < 7) return `há ${diffDays} dias`;
    return date.toLocaleDateString('pt-BR');
  }

  carregarCatalogo() {
    this.bookService.searchBooks('computação').subscribe(res => {
      this.allBooksTI = res.items || [];
      this.aplicarFiltro();
    });
    this.bookService.searchBooks('medicina').subscribe(res => {
      this.allBooksSaude = res.items || [];
      this.aplicarFiltro();
    });
    this.bookService.searchBooks('direito').subscribe(res => {
      this.allBooksDireito = res.items || [];
      this.aplicarFiltro();
    });
    this.bookService.searchBooks('ficção científica').subscribe(res => {
      this.allBooksFiccao = res.items || [];
      this.aplicarFiltro();
    });
    this.bookService.searchBooks('romance').subscribe(res => {
      this.allBooksRomance = res.items || [];
      this.aplicarFiltro();
    });
    this.bookService.searchBooks('história do brasil').subscribe(res => {
      this.allBooksHistoria = res.items || [];
      this.aplicarFiltro();
    });
  }

  aplicarFiltro() {
    // Aplicar filtro baseado no activeFilter
    if (this.activeFilter === 'tudo') {
      // Mostrar todos os livros
      this.booksTI = this.allBooksTI;
      this.booksSaude = this.allBooksSaude;
      this.booksDireito = this.allBooksDireito;
      this.booksFiccao = this.allBooksFiccao;
      this.booksRomance = this.allBooksRomance;
      this.booksHistoria = this.allBooksHistoria;
    } else if (this.activeFilter === 'academico') {
      // Mostrar apenas livros acadêmicos (TI, Saúde, Direito)
      this.booksTI = this.allBooksTI;
      this.booksSaude = this.allBooksSaude;
      this.booksDireito = this.allBooksDireito;
      this.booksFiccao = [];
      this.booksRomance = [];
      this.booksHistoria = [];
    } else if (this.activeFilter === 'literatura') {
      // Mostrar apenas literatura (Ficção, Romance, História)
      this.booksTI = [];
      this.booksSaude = [];
      this.booksDireito = [];
      this.booksFiccao = this.allBooksFiccao;
      this.booksRomance = this.allBooksRomance;
      this.booksHistoria = this.allBooksHistoria;
    } else if (this.activeFilter === 'tccs') {
      // Para TCCs, podemos filtrar por palavras-chave específicas
      const tccKeywords = ['tcc', 'trabalho de conclusão', 'monografia', 'dissertação'];
      this.booksTI = this.allBooksTI.filter(book => 
        tccKeywords.some(keyword => 
          book.volumeInfo.title?.toLowerCase().includes(keyword) ||
          book.volumeInfo.description?.toLowerCase().includes(keyword)
        )
      );
      this.booksSaude = this.allBooksSaude.filter(book => 
        tccKeywords.some(keyword => 
          book.volumeInfo.title?.toLowerCase().includes(keyword) ||
          book.volumeInfo.description?.toLowerCase().includes(keyword)
        )
      );
      this.booksDireito = this.allBooksDireito.filter(book => 
        tccKeywords.some(keyword => 
          book.volumeInfo.title?.toLowerCase().includes(keyword) ||
          book.volumeInfo.description?.toLowerCase().includes(keyword)
        )
      );
      this.booksFiccao = [];
      this.booksRomance = [];
      this.booksHistoria = [];
    } else if (this.activeFilter === 'artigos') {
      // Para artigos, filtrar por palavras-chave
      const artigoKeywords = ['artigo', 'paper', 'journal', 'revista', 'pesquisa'];
      this.booksTI = this.allBooksTI.filter(book => 
        artigoKeywords.some(keyword => 
          book.volumeInfo.title?.toLowerCase().includes(keyword) ||
          book.volumeInfo.description?.toLowerCase().includes(keyword) ||
          book.volumeInfo.categories?.some((cat: string) => cat.toLowerCase().includes(keyword))
        )
      );
      this.booksSaude = this.allBooksSaude.filter(book => 
        artigoKeywords.some(keyword => 
          book.volumeInfo.title?.toLowerCase().includes(keyword) ||
          book.volumeInfo.description?.toLowerCase().includes(keyword) ||
          book.volumeInfo.categories?.some((cat: string) => cat.toLowerCase().includes(keyword))
        )
      );
      this.booksDireito = this.allBooksDireito.filter(book => 
        artigoKeywords.some(keyword => 
          book.volumeInfo.title?.toLowerCase().includes(keyword) ||
          book.volumeInfo.description?.toLowerCase().includes(keyword) ||
          book.volumeInfo.categories?.some((cat: string) => cat.toLowerCase().includes(keyword))
        )
      );
      this.booksFiccao = [];
      this.booksRomance = [];
      this.booksHistoria = [];
    }
  }

  setTab(tab: 'feed' | 'catalogo') {
    this.activeTab = tab;
    // Se mudar para catálogo, garantir que o conteúdo seja exibido
    if (tab === 'catalogo' && this.booksTI.length === 0) {
      this.carregarCatalogo();
    }
    // Se mudar para feed e ainda não carregou, tentar carregar
    if (tab === 'feed' && this.posts.length === 0 && !this.isLoadingPosts) {
      this.carregarFeed();
    }
  }

  setFilter(filter: 'tudo' | 'academico' | 'literatura' | 'tccs' | 'artigos') {
    this.activeFilter = filter;
    this.aplicarFiltro();
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