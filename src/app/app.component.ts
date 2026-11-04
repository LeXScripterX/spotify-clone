import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { MiniPlayerComponent } from './components/mini-player/mini-player.component';
import { PlayerService } from './services/player.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonApp, IonRouterOutlet, MiniPlayerComponent],
})
export class AppComponent {
  playerService = inject(PlayerService);
}
