import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  encapsulation: ViewEncapsulation.None
})

export class AppComponent {
  title = 'frontend';
}
