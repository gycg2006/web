import { Component, HostListener } from '@angular/core'; // <--- Adicione HostListener
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Logo } from '../logo/logo'; // ou LogoComponent

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, Logo],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  isHidden = false; // Controla se a barra está escondida
  lastScrollTop = 0; // Guarda a posição anterior para comparar

  constructor(private router: Router) {}

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
    console.log('Saindo...');
    this.router.navigate(['/login']);
  }
}