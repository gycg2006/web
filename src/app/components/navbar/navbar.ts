import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Logo } from '../logo/logo';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, Logo],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  isHidden = false;
  lastScrollTop = 0;
  currentUser: any = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  // Escuta o evento de rolagem da janela
  @HostListener('window:scroll')
  onScroll() {
    const currentScroll = window.scrollY || document.documentElement.scrollTop;

    // Se rolar para baixo E já tiver passado do topo (60px)
    if (currentScroll > this.lastScrollTop && currentScroll > 60) {
      this.isHidden = true; // Esconde
    } else {
      this.isHidden = false; // Mostra (rolando pra cima)
    }

    // Atualiza a posição para a próxima comparação
    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }

  logout() {
    this.authService.logout();
    this.toastService.info('Logout realizado com sucesso');
  }
}