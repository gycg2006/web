import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [CommonModule, Navbar, RouterModule, FormsModule],
  templateUrl: './friends.html',
  styleUrls: ['./friends.css']
})
export class Friends implements OnInit {
  
  searchQuery = '';
  
  // Controle de Modais
  isDeleteModalOpen = false;
  isAddModalOpen = false;
  
  friendToDelete: any = null;
  
  // Variáveis para Busca de Novos Amigos
  newFriendQuery = '';
  newFriendResults: any[] = [];
  isLoading = false;

  // Lista de Amigos Atuais (agora vem do backend)
  friends: any[] = [];
  suggestions: any[] = [];
  pendingRequests: any[] = [];
  currentUser: any = null;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadFriends();
    this.loadPendingRequests();
  }

  loadFriends() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      this.toastService.error('Usuário não autenticado');
      return;
    }

    this.isLoading = true;
    this.apiService.getFriends(currentUser.id).subscribe({
      next: (friends) => {
        this.friends = friends.map((friend: any) => ({
          id: friend.id,
          name: friend.nome || friend.name,
          matricula: friend.matricula,
          avatar: friend.fotoPerfil || friend.avatar || 'https://i.pravatar.cc/150',
          course: friend.curso || 'Curso não informado',
          status: 'Online' // Pode ser melhorado depois
        }));
        this.isLoading = false;
        this.cdr.detectChanges(); // Forçar detecção de mudanças
      },
      error: (error) => {
        console.error('Erro ao carregar amigos:', error);
        this.toastService.error('Erro ao carregar lista de amigos');
        this.isLoading = false;
        this.cdr.detectChanges(); // Forçar detecção de mudanças mesmo em erro
      }
    });
  }

  get filteredFriends() {
    return this.friends.filter(f => 
      f.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
      f.matricula.includes(this.searchQuery)
    );
  }

  addFriend(person: any) {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      this.toastService.error('Usuário não autenticado');
      return;
    }

    this.apiService.sendFriendRequest(currentUser.id, person.id).subscribe({
      next: () => {
        this.toastService.success('Solicitação de amizade enviada!');
        person.requestSent = true;
      },
      error: (error) => {
        const errorMessage = error.error?.error || 'Erro ao enviar solicitação de amizade';
        this.toastService.error(errorMessage);
      }
    });
  }

  confirmRemove(friend: any) {
    this.friendToDelete = friend;
    this.isDeleteModalOpen = true;
  }

  cancelRemove() {
    this.isDeleteModalOpen = false;
    this.friendToDelete = null;
  }

  deleteFriend() {
    if (!this.friendToDelete) return;

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      this.toastService.error('Usuário não autenticado');
      return;
    }

    this.apiService.removeFriend(currentUser.id, this.friendToDelete.id).subscribe({
      next: () => {
        this.toastService.success('Amizade removida com sucesso');
        this.friends = this.friends.filter(f => f.id !== this.friendToDelete.id);
        this.cancelRemove();
      },
      error: (error) => {
        const errorMessage = error.error?.error || 'Erro ao remover amizade';
        this.toastService.error(errorMessage);
      }
    });
  }

  // --- LÓGICA DO MODAL DE ADICIONAR ---
  openAddModal() {
    this.isAddModalOpen = true;
    this.newFriendQuery = '';
    this.newFriendResults = [];
  }

  closeAddModal() {
    this.isAddModalOpen = false;
  }

  searchNewFriends() {
    if (!this.newFriendQuery.trim()) {
      this.newFriendResults = [];
      return;
    }

    this.isLoading = true;
    this.apiService.searchUsers(this.newFriendQuery).subscribe({
      next: (users) => {
        // Filtra usuários que já são amigos
        const friendIds = this.friends.map(f => f.id);
        this.newFriendResults = users
          .filter((user: any) => !friendIds.includes(user.id))
          .map((user: any) => ({
            id: user.id,
            name: user.nome || user.name,
            matricula: user.matricula,
            avatar: user.fotoPerfil || user.avatar || 'https://i.pravatar.cc/150',
            course: user.curso || 'Curso não informado',
            requestSent: false
          }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao buscar usuários:', error);
        this.toastService.error('Erro ao buscar usuários');
        this.isLoading = false;
      }
    });
  }

  sendRequest(user: any) {
    this.addFriend(user);
  }

  loadPendingRequests() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return;
    }

    this.apiService.getPendingRequests(currentUser.id).subscribe({
      next: (requests) => {
        this.pendingRequests = requests.map((user: any) => ({
          id: user.id,
          name: user.nome || user.name,
          matricula: user.matricula,
          avatar: user.fotoPerfil || user.avatar || 'https://i.pravatar.cc/150',
          course: user.curso || 'Curso não informado'
        }));
        this.cdr.detectChanges(); // Forçar detecção de mudanças
      },
      error: (error) => {
        console.error('Erro ao carregar solicitações pendentes:', error);
        this.cdr.detectChanges(); // Forçar detecção de mudanças mesmo em erro
      }
    });
  }

  acceptRequest(request: any) {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      this.toastService.error('Usuário não autenticado');
      return;
    }

    this.apiService.acceptFriendRequest(currentUser.id, request.id).subscribe({
      next: () => {
        this.toastService.success(`Você aceitou a solicitação de ${request.name}!`);
        this.loadPendingRequests();
        this.loadFriends(); // Recarregar lista de amigos
        this.cdr.detectChanges(); // Forçar detecção de mudanças
      },
      error: (error) => {
        const errorMessage = error.error?.error || 'Erro ao aceitar solicitação';
        this.toastService.error(errorMessage);
      }
    });
  }

  rejectRequest(request: any) {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      this.toastService.error('Usuário não autenticado');
      return;
    }

    this.apiService.removeFriend(currentUser.id, request.id).subscribe({
      next: () => {
        this.toastService.success('Solicitação recusada');
        this.loadPendingRequests();
        this.cdr.detectChanges(); // Forçar detecção de mudanças
      },
      error: (error) => {
        const errorMessage = error.error?.error || 'Erro ao recusar solicitação';
        this.toastService.error(errorMessage);
      }
    });
  }
}