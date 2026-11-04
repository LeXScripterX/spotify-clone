import { Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  chevronDown,
  playSkipBack,
  playCircle,
  pauseCircle,
  playSkipForward,
  musicalNote,
  text,
} from 'ionicons/icons';
import { LyricsComponent } from '../../components/lyrics/lyrics.component';
import { PlayerService } from '../../services/player.service';
import { LyricsService } from '../../services/lyrics.service';
import { NavidromeService } from '../../services/navidrome.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.page.html',
  styleUrls: ['./player.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    LyricsComponent,
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
    this.showLyrics.update((v) => !v);
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
}
