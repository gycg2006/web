import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [CommonModule, Navbar, RouterModule, FormsModule],
  templateUrl: './friends.html',
  styleUrls: ['./friends.css']
})
export class Friends {
  
  searchQuery = '';
  
  // Controle de Modais
  isDeleteModalOpen = false;
  isAddModalOpen = false; // Novo modal
  
  friendToDelete: any = null;
  
  // Variáveis para Busca de Novos Amigos
  newFriendQuery = '';
  newFriendResults: any[] = [];

  // Lista de Amigos Atuais
  friends = [
    { 
      name: 'Carlos Eduardo', 
      matricula: '2310101', 
      avatar: 'https://i.pravatar.cc/150?u=carlos', 
      course: 'Engenharia de Software',
      status: 'Lendo "Duna"' 
    },
    { 
      name: 'Ana Clara', 
      matricula: '2310202', 
      avatar: 'https://i.pravatar.cc/150?u=ana', 
      course: 'Ciência da Computação',
      status: 'Online' 
    },
    { 
      name: 'Pedro Henrique', 
      matricula: '2310303', 
      avatar: 'https://i.pravatar.cc/150?u=pedro', 
      course: 'Direito',
      status: 'Offline' 
    },
    { 
      name: 'Mariana Costa', 
      matricula: '2310404', 
      avatar: 'https://i.pravatar.cc/150?u=mari', 
      course: 'Psicologia',
      status: 'Lendo "O Pequeno Príncipe"' 
    },
    { 
      name: 'Lucas Lima', 
      matricula: '2310505', 
      avatar: 'https://i.pravatar.cc/150?u=lucas', 
      course: 'Ciência da Computação',
      status: 'Online' 
    }
  ];

  // Banco de Dados Simulado de TODOS os alunos (para busca)
  allUsersDB = [
    { name: 'João Silva', matricula: '2310999', avatar: 'https://i.pravatar.cc/150?u=joao', course: 'Arquitetura', requestSent: false },
    { name: 'Maria Oliveira', matricula: '2310888', avatar: 'https://i.pravatar.cc/150?u=maria', course: 'Jornalismo', requestSent: false },
    { name: 'Ricardo Santos', matricula: '2310777', avatar: 'https://i.pravatar.cc/150?u=ricardo', course: 'Direito', requestSent: false },
    { name: 'Sofia Lima', matricula: '2310666', avatar: 'https://i.pravatar.cc/150?u=sofia', course: 'Medicina', requestSent: false },
    { name: 'Bruno Costa', matricula: '2310555', avatar: 'https://i.pravatar.cc/150?u=bruno', course: 'Cinema', requestSent: false }
  ];

  suggestions = [
    { name: 'Fernanda Souza', matricula: '2310606', avatar: 'https://i.pravatar.cc/150?u=fernanda', mutuals: 5 },
    { name: 'Roberto Silva', matricula: '2310707', avatar: 'https://i.pravatar.cc/150?u=roberto', mutuals: 2 },
    { name: 'Julia Martins', matricula: '2310808', avatar: 'https://i.pravatar.cc/150?u=julia', mutuals: 8 }
  ];

  get filteredFriends() {
    return this.friends.filter(f => 
      f.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
      f.matricula.includes(this.searchQuery)
    );
  }

  addFriend(person: any) {
    this.friends.push({
      ...person,
      course: 'Novo Aluno',
      status: 'Novo Amigo!'
    });
    this.suggestions = this.suggestions.filter(p => p !== person);
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
    if (this.friendToDelete) {
      this.friends = this.friends.filter(f => f !== this.friendToDelete);
      this.cancelRemove();
    }
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

    const query = this.newFriendQuery.toLowerCase();
    
    // Filtra do banco simulado quem NÃO é amigo ainda
    this.newFriendResults = this.allUsersDB.filter(user => 
      (user.name.toLowerCase().includes(query) || user.matricula.includes(query)) &&
      !this.friends.some(f => f.matricula === user.matricula)
    );
  }

  sendRequest(user: any) {
    user.requestSent = true;
    // Aqui você chamaria o backend para criar a notificação
  }
}