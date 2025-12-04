import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mascot',
  standalone: true, // <--- ISSO É OBRIGATÓRIO
  imports: [CommonModule],
  templateUrl: './mascot.html', // Caminho curto
  styleUrls: ['./mascot.css']     // Caminho curto
})
export class Mascot { // <--- NOME DA CLASSE É APENAS 'Mascot'
  @Input() imagemAtual: string = 'images/moema.png'; 
}