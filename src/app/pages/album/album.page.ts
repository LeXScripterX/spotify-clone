import { Component, effect, inject, input, signal } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonButton,
  IonSpinner, IonTitle } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { playCircle, musicalNote, play } from 'ionicons/icons';

import type { Album, Song } from '../../models/subsonic.models';
import { NavidromeService } from '../../services/navidrome.service';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.page.html',
  styleUrls: ['./album.page.scss'],
  imports: [IonTitle, 
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonButton,
    IonSpinner,
  ],
})
export class AlbumPage {
  id = input.required<string>();

  private readonly navidromeService = inject(NavidromeService);
  private readonly playerService = inject(PlayerService);

  album = signal<Album | null>(null);
  isLoading = signal<boolean>(true);

  constructor() {
    addIcons({ playCircle, musicalNote, play });

    effect(() => {
      const albumId = this.id();
      if (albumId) {
        this.loadAlbum(albumId);
      }
    });
  }

  private loadAlbum(id: string): void {
    this.isLoading.set(true);
    this.navidromeService.getAlbum(id).subscribe({
      next: (album) => {
        this.album.set(album);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading album details:', err);
        this.isLoading.set(false);
      },
    });
  }

  playAlbum(): void {
    const songs = this.album()?.song;
    if (songs && songs.length > 0) {
      this.playerService.play(songs[0], songs);
    }
  }

  playSong(song: Song): void {
    const songs = this.album()?.song || [song];
    this.playerService.play(song, songs);
  }

  getCoverUrl(id: string): string {
    return this.navidromeService.getCoverArtUrl(id, 600);
  }

  formatDuration(seconds: number): string {
    if (!seconds || isNaN(seconds)) {
      return '0:00';
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
