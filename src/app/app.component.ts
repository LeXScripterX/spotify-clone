import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';

import { MiniPlayerComponent } from './components/mini-player/mini-player.component';
import { PlayerService } from './services/player.service';
import { UserMenuComponent } from './components/user-menu/user-menu.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet, MiniPlayerComponent, UserMenuComponent],
})
export class AppComponent {
  playerService = inject(PlayerService);
}