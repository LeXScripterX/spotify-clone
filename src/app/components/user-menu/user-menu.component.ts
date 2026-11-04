import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon, PopoverController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmarkOutline, openOutline, home, search, library, downloadOutline, notificationsOutline } from 'ionicons/icons';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  standalone: true,
  imports: [IonIcon],
})
export class UserMenuComponent {
  private readonly popoverCtrl = inject(PopoverController);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  constructor() {
    addIcons({home,search,library,downloadOutline,notificationsOutline,openOutline,checkmarkOutline});
  }

  onOption(option: string): void {
    this.popoverCtrl.dismiss();
    if (option === 'perfil') {
      this.router.navigate(['/tabs/profile']);
    }
  }

  logout(): void {
    this.popoverCtrl.dismiss();
    if (this.authService?.logout) {
      this.authService.logout();
    }
    this.router.navigate(['/login']);
  }
}