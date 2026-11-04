import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonInput,
  IonItem,
  IonList,
  IonIcon,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { musicalNotes } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    FormsModule,
    IonContent,
    IonButton,
    IonInput,
    IonItem,
    IonList,
    IonIcon,
  ],
})
export class LoginPage {
  authService = inject(AuthService);
  router = inject(Router);

  username = '';
  password = '';

  constructor() {
    addIcons({ musicalNotes, 'musical-notes': musicalNotes });
  }

  async login(): Promise<void> {
    try {
      await this.authService.login(this.username, this.password);
      this.router.navigate(['/tabs/home']);
    } catch (error) {
      console.error('Error during login:', error);
    }
  }
}
