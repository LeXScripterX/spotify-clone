export interface SubsonicResponse<T = Record<string, unknown>> {
  'subsonic-response': {
    status: string;
    version: string;
    type?: string;
    serverVersion?: string;
    openSubsonic?: boolean;
  } & T;
}

export interface Album {
  id: string;
  name: string;
  artist: string;
  artistId: string;
  coverArt: string;
  songCount: number;
  duration: number;
  year?: number;
  genre?: string;
  song?: Song[];
  created?: string;
}

export interface Song {
  id: string;
  title: string;
  album: string;
  albumId: string;
  artist: string;
  artistId: string;
  track: number;
  duration: number;
  coverArt: string;
  suffix: string;
  bitRate?: number;
  size?: number;
  year?: number;
  genre?: string;
}

export interface Artist {
  id: string;
  name: string;
  albumCount: number;
  coverArt?: string;
  artistImageUrl?: string;
}

export interface ArtistIndex {
  name: string;
  artist: Artist[];
}

export interface LyricLine {
  start?: number;
  value: string;
}

export interface StructuredLyrics {
  lang: string;
  synced: boolean;
  line: LyricLine[];
}
