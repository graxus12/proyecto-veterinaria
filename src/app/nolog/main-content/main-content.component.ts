import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main-content',
  standalone: true,
 imports: [CommonModule, FormsModule],
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.css']
})
export class MainContentComponent {
  // Array de imágenes
  images = [
    '/img/bodoque1.jpeg',
    '/img/bodoque2.jpeg',
    '/img/doky1.jpeg',
    '/img/image4.jpg',
    '/img/image5.jpeg',
    '/img/image6.jpeg'
  ];

  // Índice de la primera imagen visible en el carrusel
  currentImageIndex = 0;

  // Método que devuelve las tres imágenes que se deben mostrar
  get currentImages() {
    return this.images.slice(this.currentImageIndex, this.currentImageIndex + 3);
  }

  // Función para cambiar a la siguiente fila de tres imágenes
  nextImages() {
    if (this.currentImageIndex < this.images.length - 3) {
      this.currentImageIndex += 3; // Avanza tres imágenes
    } else {
      this.currentImageIndex = 0; // Vuelve a la primera imagen al final
    }
  }

  // Función para cambiar a la fila anterior de tres imágenes
  prevImages() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex -= 3; // Retrocede tres imágenes
    } else {
      this.currentImageIndex = this.images.length - 3; // Vuelve a la última fila al principio
    }
  }
}
