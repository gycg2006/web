import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule, Navbar, RouterModule],
  templateUrl: './community.html',
  styleUrls: ['./community.css']
})
export class Community implements OnInit {
  
  activeTab: 'clubes' | 'eventos' = 'clubes';
  currentUser: any = null;

  // Mock de Clubes de Leitura
  clubs = [
    {
      id: 1,
      name: 'Clube de Ficção Científica',
      members: 128,
      description: 'Discutimos clássicos e novidades do mundo Sci-Fi. Encontros quinzenais.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      nextMeeting: '15/11 às 18h'
    },
    {
      id: 2,
      name: 'Leitores de Direito',
      members: 340,
      description: 'Grupo de estudos focado em bibliografia jurídica e debates de casos.',
      image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      nextMeeting: 'Segundas às 14h'
    },
    {
      id: 3,
      name: 'Poesia na Unifor',
      members: 85,
      description: 'Espaço para leitura e declamação de poesias autorais e clássicas.',
      image: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      nextMeeting: 'Sextas às 17h'
    }
  ];

  // Mock de Eventos
  events = [
    {
      id: 1,
      title: 'Feira do Livro Universitário',
      date: '20 NOV',
      time: '09:00 - 18:00',
      location: 'Centro de Convivência',
      image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
      id: 2,
      title: 'Palestra: O Futuro da IA na Literatura',
      date: '25 NOV',
      time: '19:00',
      location: 'Auditório A',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
      id: 3,
      title: 'Lançamento: "Memórias de Fortaleza"',
      date: '02 DEZ',
      time: '18:30',
      location: 'Biblioteca Central',
      image: 'https://images.unsplash.com/photo-1544928147-79a77456a14e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    }
  ];

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    // Garantir que o conteúdo seja exibido ao carregar
    this.activeTab = 'clubes';
    // Forçar detecção de mudanças para garantir que o conteúdo seja renderizado
    this.cdr.detectChanges();
  }

  setTab(tab: 'clubes' | 'eventos') {
    this.activeTab = tab;
  }

  joinClub(club: any) {
    alert(`Você entrou no clube "${club.name}"!`);
  }

  registerEvent(event: any) {
    alert(`Inscrição confirmada para "${event.title}"!`);
  }
}