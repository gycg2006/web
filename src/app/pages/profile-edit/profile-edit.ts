import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './profile-edit.html',
  styleUrls: ['./profile-edit.css']
})
export class ProfileEdit implements OnInit {
  // Dados do Usuário
  user = {
    id: 0,
    name: '',
    matricula: '',
    bio: '',
    avatar: 'images/moema.png',
    course: '',
    semester: ''
  };

  previewAvatar: string | ArrayBuffer | null = null;
  isLoading = false;
  selectedFile: File | null = null;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      this.user.id = currentUser.id;
      this.user.matricula = currentUser.matricula || '';
      this.user.name = currentUser.nome || 'Usuário';
      this.user.bio = currentUser.bio || '';
      this.user.avatar = currentUser.fotoPerfil || 'images/moema.png';
      
      // Carregar dados completos do backend
      this.apiService.getUser(currentUser.id).subscribe({
        next: (userData) => {
          this.user.name = userData.nome || this.user.name;
          this.user.bio = userData.bio || '';
          this.user.course = userData.curso || '';
          this.user.avatar = userData.fotoPerfil || this.user.avatar;
        },
        error: () => {
          this.toastService.warning('Não foi possível carregar os dados completos do perfil');
        }
      });
    }
  }

  // Quando o usuário escolhe um arquivo
  onFileSelected(event: any) {
    const file = event.target.files[0];
    
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        this.toastService.error('Por favor, selecione uma imagem válida');
        return;
      }

      // Validar tamanho (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.toastService.error('A imagem deve ter no máximo 5MB');
        return;
      }

      this.selectedFile = file;

      // Criar Preview local
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewAvatar = e.target?.result || null;
        // Converter para base64 para salvar (simplificado - em produção use upload de arquivo)
        this.user.avatar = this.previewAvatar as string;
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    if (!this.user.id) {
      this.toastService.error('Usuário não identificado');
      return;
    }

    this.isLoading = true;

    const userData = {
      nome: this.user.name,
      bio: this.user.bio,
      curso: this.user.course,
      fotoPerfil: this.user.avatar
    };

    this.apiService.updateUser(this.user.id, userData).subscribe({
      next: (updatedUser) => {
        this.isLoading = false;
        this.toastService.success('Perfil atualizado com sucesso!');
        
        // Atualizar usuário no localStorage
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          currentUser.nome = updatedUser.nome;
          currentUser.bio = updatedUser.bio;
          currentUser.curso = updatedUser.curso;
          currentUser.fotoPerfil = updatedUser.fotoPerfil;
          localStorage.setItem('currentUser', JSON.stringify({
            user: currentUser,
            token: this.authService.getToken()
          }));
          // Atualizar o observable também
          this.authService.updateCurrentUser(currentUser);
        }
        
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1000);
      },
      error: (error) => {
        this.isLoading = false;
        const errorMessage = error.error?.error || 'Erro ao atualizar perfil';
        this.toastService.error(errorMessage);
      }
    });
  }

  cancel() {
    this.router.navigate(['/home']);
  }
}