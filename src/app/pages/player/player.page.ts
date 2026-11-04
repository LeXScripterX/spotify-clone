import { Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonIcon, IonRange } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  chevronDown,
  musicalNote,
  pauseCircle,
  playCircle,
  playSkipBack,
  playSkipForward,
  text,
  volumeHigh,
  volumeLow,
  volumeMedium,
  volumeMute,
} from 'ionicons/icons';

import { LyricsComponent } from '../../components/lyrics/lyrics.component';
import { LyricsService } from '../../services/lyrics.service';
import { NavidromeService } from '../../services/navidrome.service';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.page.html',
  styleUrls: ['./player.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonContent,
    IonIcon,
    LyricsComponent,
    IonRange
  ],
})
export class PlayerPage {
  readonly playerService = inject(PlayerService);
  readonly lyricsService = inject(LyricsService);
  private readonly navidromeService = inject(NavidromeService);
  private readonly router = inject(Router);

  showLyrics = signal<boolean>(false);

  constructor() {
    addIcons({
      chevronDown,
      playSkipBack,
      playCircle,
      pauseCircle,
      playSkipForward,
      musicalNote,
      text,
       volumeHigh,
  volumeLow,
  volumeMedium,
  volumeMute,
    });

    effect(() => {
      const song = this.playerService.currentSong();
      if (song) {
        this.lyricsService.loadLyrics(song.id);
      } else {
        this.lyricsService.clear();
      }
    });

    effect(() => {
      const currentTime = this.playerService.currentTime();
      this.lyricsService.updateTime(currentTime * 1000);
    });
  }

  getCoverUrl(): string {
    const song = this.playerService.currentSong();
    if (!song) {
      return '';
    }
    return this.navidromeService.getCoverArtUrl(song.coverArt || song.id, 600);
  }

  toggleLyrics(): void {
    this.showLyrics.update((v: boolean) => !v);
  }

  onProgressClick(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    this.playerService.seekToPercent(percent);
  }

  goBack(): void {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(['/tabs/home']);
    }
  }

  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) {
      return '0:00';
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  volumeIcon(): string {
  const v = this.playerService.volume();
  if (v === 0) return 'volume-mute';
  if (v < 0.34) return 'volume-low';
  if (v < 0.67) return 'volume-medium';
  return 'volume-high';
}

onVolume(event: Event): void {
  const value = Number((event as CustomEvent).detail.value);
  this.playerService.setVolume(value / 100);
}
}