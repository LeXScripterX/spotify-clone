import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonThumbnail,
  IonLabel,
  IonSpinner,
} from '@ionic/angular';
import { NavidromeService } from '../../services/navidrome.service';
import { Album } from '../../models/subsonic.models';

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonList,
    IonItem,
    IonThumbnail,
    IonLabel,
    IonSpinner,
  ],
})
export class LibraryPage implements OnInit {
  private readonly navidromeService = inject(NavidromeService);
  private readonly router = inject(Router);

  albums = signal<Album[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadAlbums();
  }

  private loadAlbums(): void {
    this.isLoading.set(true);
    this.navidromeService.getAlbums(50, 0, 'alphabeticalByName').subscribe({
      next: (albums) => {
        this.albums.set(albums);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading library albums:', err);
        this.isLoading.set(false);
      },
    });
  }

  openAlbum(id: string): void {
    this.router.navigate(['/album', id]);
  }

  getCoverUrl(id: string): string {
    return this.navidromeService.getCoverArtUrl(id, 200);
  }
}
