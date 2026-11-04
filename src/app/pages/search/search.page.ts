import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonSearchbar,
  IonList,
  IonItem,
  IonThumbnail,
  IonLabel,
  IonSpinner,
  IonIcon,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { musicalNote, disc, searchOutline } from 'ionicons/icons';

import type { Album, Artist, Song } from '../../models/subsonic.models';
import { NavidromeService } from '../../services/navidrome.service';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonSearchbar,
    IonList,
    IonItem,
    IonThumbnail,
    IonLabel,
    IonSpinner,
    IonIcon,
  ],
})
export class SearchPage {
  private readonly navidromeService = inject(NavidromeService);
  private readonly playerService = inject(PlayerService);
  private readonly router = inject(Router);

  query = signal<string>('');
  searchResults = signal<{ artists: Artist[]; albums: Album[]; songs: Song[] }>({
    artists: [],
    albums: [],
    songs: [],
  });
  isLoading = signal<boolean>(false);

  constructor() {
    addIcons({ musicalNote, disc, searchOutline });
  }

  onSearch(event: CustomEvent): void {
    const val = (event.detail?.value || '').trim();
    this.query.set(val);

    if (!val) {
      this.searchResults.set({ artists: [], albums: [], songs: [] });
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);
    this.navidromeService.search(val).subscribe({
      next: (results) => {
        this.searchResults.set(results);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error during search:', err);
        this.isLoading.set(false);
      },
    });
  }

  playSong(song: Song): void {
    this.playerService.play(song, this.searchResults().songs);
  }

  openAlbum(id: string): void {
    this.router.navigate(['/album', id]);
  }

  getCoverUrl(id: string): string {
    return this.navidromeService.getCoverArtUrl(id, 200);
  }
}
