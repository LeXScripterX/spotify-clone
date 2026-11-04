import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { IonIcon, IonRange } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  listOutline,
  micOutline,
  pause,
  play,
  playSkipBack,
  playSkipForward,
  repeat,
  shuffle,
  volumeHigh,
  volumeLow,
  volumeMute,
} from 'ionicons/icons';
import { filter, map } from 'rxjs';

import { NavidromeService } from '../../services/navidrome.service';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-mini-player',
  templateUrl: './mini-player.component.html',
  styleUrls: ['./mini-player.component.scss'],
  standalone: true,
  imports: [IonIcon, IonRange],
  host: { '[hidden]': 'hidden()' },
})
export class MiniPlayerComponent {
  readonly playerService = inject(PlayerService);
  private readonly navidromeService = inject(NavidromeService);
  private readonly router = inject(Router);

  private readonly shouldHideRoute = (url: string) =>
    url.startsWith('/player') || url.startsWith('/login');

  // Evalúa si la ruta actual exige ocultar el reproductor
  private readonly isRouteHidden = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => this.shouldHideRoute((e as NavigationEnd).urlAfterRedirects)),
    ),
    { initialValue: this.shouldHideRoute(this.router.url) },
  );

  // Oculta si la ruta lo requiere O si NO hay canción activa
  readonly hidden = computed(() => {
    return this.isRouteHidden() || !this.playerService.currentSong();
  });

  constructor() {
    addIcons({
      play,
      pause,
      shuffle,
      repeat,
      playSkipBack,
      playSkipForward,
      addCircleOutline,
      micOutline,
      listOutline,
      volumeHigh,
      volumeLow,
      volumeMute,
    });
  }

  openPlayer(): void {
    this.router.navigate(['/player']);
  }

  getCoverUrl(): string {
    const song = this.playerService.currentSong();
    if (!song) return '';
    return this.navidromeService.getCoverArtUrl(song.coverArt || song.id, 100);
  }

  formatTime(seconds: number): string {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  onProgressClick(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const clickPosition = (event.clientX - rect.left) / rect.width;
    const duration = this.playerService.duration();
    if (duration > 0) {
      this.playerService.seekTo(duration * clickPosition);
    }
  }

  onVolume(event: CustomEvent): void {
    const value = event.detail.value as number;
    this.playerService.setVolume(value / 100);
  }

  volumeIcon(): string {
    const vol = this.playerService.volume();
    if (vol === 0) return 'volume-mute';
    if (vol < 0.5) return 'volume-low';
    return 'volume-high';
  }
}