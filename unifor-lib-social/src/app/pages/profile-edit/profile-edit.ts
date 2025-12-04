import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './profile-edit.html',
  styleUrls: ['./profile-edit.css']
})
export class ProfileEdit {
  // Dados do Usuário (Simulando o que viria do Banco)
  user = {
    name: 'Aluno Unifor',
    matricula: '2310058',
    bio: 'Estudante de Ciência da Computação apaixonado por tecnologia e café. ☕',
    avatar: 'images/moema.png', // Imagem inicial
    course: 'Ciência da Computação',
    semester: '4º Semestre'
  };

  previewAvatar: string | ArrayBuffer | null = null; // Para mostrar a foto nova antes de salvar

  constructor(private router: Router) {}

  // Quando o usuário escolhe um arquivo
  onFileSelected(event: any) {
    const file = event.target.files[0];
    
    if (file) {
      // 1. Aqui você prepararia o 'file' para enviar pro Backend (FormData)
      console.log('Arquivo pronto para upload:', file);

      // 2. Criar Preview local para o usuário ver na hora
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewAvatar = e.target?.result || null;
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    // Aqui viria a chamada HTTP para o Backend (PUT /users/me)
    console.log('Salvando dados...', this.user);
    
    if (this.previewAvatar) {
      console.log('Salvando nova foto...');
      // No futuro: this.userService.uploadAvatar(file)...
    }

    alert('Perfil atualizado com sucesso!');
    this.router.navigate(['/home']);
  }

  cancel() {
    this.router.navigate(['/home']);
  }
}