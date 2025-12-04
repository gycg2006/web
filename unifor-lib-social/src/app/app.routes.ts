import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { BookDetails } from './pages/book-details/book-details';
// Importação do Perfil (geralmente o Angular cria como ProfileComponent)
import { ProfileEdit } from './pages/profile-edit/profile-edit';
import { MyBooks } from './pages/my-books/my-books';  
import { Lists } from './pages/lists/lists';  
import { Friends } from './pages/friends/friends';  
import { Community } from './pages/community/community';  

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'home', component: Home },
  
  // Rota de Detalhes do Livro
  { path: 'book/:id', component: BookDetails },

  // NOVA ROTA DE PERFIL
  { path: 'profile', component: ProfileEdit },
  { path: 'mybooks', component: MyBooks },
  { path: 'lists', component: Lists },
  { path: 'friends', component: Friends },
  { path: 'community', component: Community }
];