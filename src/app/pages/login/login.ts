import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// IMPORTANTE: Ajuste os nomes das classes aqui também se necessário
// Se o seu Logo também for 'logo.ts', a classe deve ser 'Logo'
import { Logo } from '../../components/logo/logo'; // Verifique se é Logo ou LogoComponent no seu arquivo
import { Mascot } from '../../components/mascot/mascot'; // <--- Importando a classe 'Mascot'

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

  constructor(private router: Router) {}

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

    console.log('Login Sucesso:', this.matricula);
    this.router.navigate(['/home']);
  }

  mostrarErro(mensagem: string) {
    this.msgErro = mensagem;
    this.imgMoema = '/images/moema-chateada.png';
  }
}