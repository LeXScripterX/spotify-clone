import type { OnInit} from '@angular/core';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
} from '@ionic/angular';

import type { Album, Song } from '../models/subsonic.models';
import { NavidromeService } from '../services/navidrome.service';
import { PlayerService } from '../services/player.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, 
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonGrid,
    IonRow,
    IonCol,
    IonSpinner,
  ],
})
export class HomePage implements OnInit {
  private readonly navidromeService = inject(NavidromeService);
  readonly playerService = inject(PlayerService);
  private readonly router = inject(Router);

  albums = signal<Album[]>([]);
  recentSongs = signal<Song[]>([]);
  isLoading = signal<boolean>(true);

  greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      return 'Buenos días';
    }
    if (hour >= 12 && hour < 20) {
      return 'Buenas tardes';
    }
    return 'Buenas noches';
  });

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.isLoading.set(true);
    let loadedCount = 0;
    const checkDone = () => {
      loadedCount++;
      if (loadedCount >= 2) {
        this.isLoading.set(false);
      }
    };

    this.navidromeService.getAlbums(20, 0, 'newest').subscribe({
      next: (albums) => {
        this.albums.set(albums);
        checkDone();
      },
      error: (err) => {
        console.error('Error loading albums:', err);
        checkDone();
      },
    });

    this.navidromeService.getRandomSongs(10).subscribe({
      next: (songs) => {
        this.recentSongs.set(songs);
        checkDone();
      },
      error: (err) => {
        console.error('Error loading random songs:', err);
        checkDone();
      },
    });
  }

  openAlbum(id: string): void {
    this.router.navigate(['/album', id]);
  }

  playSong(song: Song, songs: Song[]): void {
    this.playerService.play(song, songs);
  }

  getCoverUrl(id: string): string {
    return this.navidromeService.getCoverArtUrl(id, 300);
  }
}
