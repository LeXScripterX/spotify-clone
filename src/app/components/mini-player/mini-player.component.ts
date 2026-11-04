import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon, IonProgressBar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { play, pause } from 'ionicons/icons';
import { PlayerService } from '../../services/player.service';
import { NavidromeService } from '../../services/navidrome.service';

@Component({
  selector: 'app-mini-player',
  templateUrl: './mini-player.component.html',
  styleUrls: ['./mini-player.component.scss'],
  imports: [IonIcon, IonProgressBar],
})
export class MiniPlayerComponent {
  readonly playerService = inject(PlayerService);
  private readonly navidromeService = inject(NavidromeService);
  private readonly router = inject(Router);

  constructor() {
    addIcons({ play, pause });
  }

  openPlayer(): void {
    this.router.navigate(['/player']);
  }

  getCoverUrl(): string {
    const song = this.playerService.currentSong();
    if (!song) {
      return '';
    }
    return this.navidromeService.getCoverArtUrl(song.coverArt || song.id, 100);
  }
}
