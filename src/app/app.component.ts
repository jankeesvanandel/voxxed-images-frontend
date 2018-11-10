import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FlickrPhotoSize, Image } from './model';
import { SpeakersService } from './speakers.service';
import { flatMap, map, tap, toArray } from 'rxjs/operators';
import { from, Observable, of } from 'rxjs';
import { AlbumsService } from './albums.service';
import { FlickrService } from './flickr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  speakerId: string;
  speakerName: string;
  images: Image[];
  albumNames: string[];

  constructor(private httpClient: HttpClient, private flickrService: FlickrService) {
  }

  ngOnInit(): void {
    const speakerId = '';
    new SpeakersService(this.httpClient).get().pipe(
      map(speakers => speakers.filter(s => s.id === speakerId)[0])
    ).subscribe(speaker => {
      this.speakerId = speaker.id;
      this.speakerName = speaker.name;

      new AlbumsService(this.httpClient).get(speakerId).pipe(
        tap(albums => this.albumNames = albums.map(a => a.name).sort()),
        flatMap(albums => from(albums)),
        flatMap(album => from(album.images.map(i => {
          i.albumName = album.name;
          return i;
        }))),
        flatMap(image => this.enhanceWithFlickrData(image)),
        toArray()
      ).subscribe(images => {
        this.images = images;
      });
    });
  }

  private enhanceWithFlickrData(image: Image): Observable<Image> {
    const localFlickrData = window.localStorage.getItem(`flickr/${image.id}`);
    if (localFlickrData) {
      image.image = JSON.parse(localFlickrData) as FlickrPhotoSize;
      return of(image);
    } else {
      return this.flickrService.getImageSizes(image.id).pipe(
        map(fpgs => fpgs.sizes.size.filter(s => s.width >= 320)[0]),
        map(s => {
          image.image = s;
          window.localStorage.setItem(`flickr/${image.id}`, JSON.stringify(s));
          return image;
        })
      );
    }
  }
}
