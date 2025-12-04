import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  isSignUpActive = false;
  showPassword = false; // <--- Essa é a variável que estava faltando!

  togglePanel(isSignUp: boolean) {
    this.isSignUpActive = isSignUp;
  }

  // Função para ligar/desligar a visualização da senha
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}