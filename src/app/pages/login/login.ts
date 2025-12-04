import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// IMPORTANTE: Ajuste os nomes das classes aqui também se necessário
// Se o seu Logo também for 'logo.ts', a classe deve ser 'Logo'
import { Logo } from '../../components/logo/logo'; // Verifique se é Logo ou LogoComponent no seu arquivo
import { Mascot } from '../../components/mascot/mascot'; // <--- Importando a classe 'Mascot'
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  // Adicione 'Mascot' na lista (tem que bater com o nome do import acima)
  imports: [CommonModule, FormsModule, Logo, Mascot], 
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  isSignUpActive = false;
  showPassword = false;
  
  matricula: string = '';
  senha: string = '';
  msgErro: string = '';
  imgMoema: string = '/images/moema.svg';
  isLoading: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  togglePanel(isSignUp: boolean) {
    this.isSignUpActive = isSignUp;
    this.limparErros();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  limparErros() {
    this.msgErro = '';
    this.imgMoema = '/images/moema.svg';
  }

  fazerLogin() {
    const matriculaValida = /^\d{7}$/.test(this.matricula);

    if (!matriculaValida) {
      this.mostrarErro('A matrícula deve ter exatamente 7 números.');
      return;
    }

    const senhaValida = /^\d{8}$/.test(this.senha);

    if (!senhaValida) {
      this.mostrarErro('A senha deve ter exatamente 8 números.');
      return;
    }

    this.isLoading = true;
    this.authService.login(this.matricula, this.senha).subscribe({
      next: (user) => {
        this.isLoading = false;
        console.log('Login Sucesso:', user);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.isLoading = false;
        // Extrair mensagem de erro do backend ou usar mensagem padrão
        let errorMessage = 'Matrícula ou senha incorretos. Verifique suas credenciais.';
        
        if (error.error) {
          // Se o erro vem como string JSON
          if (typeof error.error === 'string') {
            try {
              const parsed = JSON.parse(error.error);
              errorMessage = parsed.error || errorMessage;
            } catch {
              // Se não conseguir parsear, usa a string como está
              errorMessage = error.error;
            }
          } 
          // Se o erro vem como objeto
          else if (error.error.error) {
            errorMessage = error.error.error;
          }
        }
        
        this.mostrarErro(errorMessage);
      }
    });
  }

  fazerCadastro() {
    const matriculaValida = /^\d{7}$/.test(this.matricula);

    if (!matriculaValida) {
      this.mostrarErro('A matrícula deve ter exatamente 7 números.');
      return;
    }

    const senhaValida = /^\d{8}$/.test(this.senha);

    if (!senhaValida) {
      this.mostrarErro('A senha deve ter exatamente 8 números.');
      return;
    }

    this.isLoading = true;
    this.authService.register(this.matricula, this.senha).subscribe({
      next: (user) => {
        this.isLoading = false;
        console.log('Cadastro Sucesso:', user);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.isLoading = false;
        // Extrair mensagem de erro do backend ou usar mensagem padrão
        let errorMessage = 'Erro ao fazer cadastro. Tente novamente.';
        
        if (error.error) {
          // Se o erro vem como string JSON
          if (typeof error.error === 'string') {
            try {
              const parsed = JSON.parse(error.error);
              errorMessage = parsed.error || errorMessage;
            } catch {
              // Se não conseguir parsear, usa a string como está
              errorMessage = error.error;
            }
          } 
          // Se o erro vem como objeto
          else if (error.error.error) {
            errorMessage = error.error.error;
          }
        }
        
        this.mostrarErro(errorMessage);
      }
    });
  }

  mostrarErro(mensagem: string) {
    this.msgErro = mensagem;
    this.imgMoema = '/images/moema-chateada.png';
  }
}