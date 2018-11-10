import { Component, OnInit } from '@angular/core';
import { FlickrPhotoSize, Image } from '../model';
import { FlickrService } from '../flickr.service';
import { SpeakersService } from '../speakers.service';
import { distinct, filter, flatMap, map, take, tap, toArray } from 'rxjs/operators';
import { AlbumsService } from '../albums.service';
import { from, Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-voxxian',
  templateUrl: './voxxian.component.html',
  styleUrls: ['./voxxian.component.css']
})
export class VoxxianComponent implements OnInit {
  speakerId: string;
  speakerName: string;
  images: Image[][];
  albumNames: string[];

  constructor(private route: ActivatedRoute, private speakersService: SpeakersService, private albumsService: AlbumsService,
              private flickrService: FlickrService) {
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['voxxian'];
    this.speakersService.get().pipe(
      map(speakers => speakers.filter(s => s.id === id)[0])
    ).subscribe(speaker => {
      this.speakerId = speaker.id;
      this.speakerName = speaker.name;

      this.albumsService.get(id).pipe(
        map(albums => albums.sort().reverse()),
        tap(albums => this.albumNames = albums.map(a => a.name)),
        flatMap(albums => from(albums)),
        flatMap(album => from(album.images.map(i => {
          i.albumName = album.name;
          return i;
        }))),
        filter(image => image.validation),
        distinct(image => image.id),
        take(100),
        flatMap(image => this.enhanceWithFlickrData(image)),
        toArray()
      ).subscribe(images => {
        const imagesLength = images.length;
        if (imagesLength > 0) {
          const group1 = images.slice(0, imagesLength * 0.25);
          const group2 = images.slice(imagesLength * 0.25, imagesLength * 0.5);
          const group3 = images.slice(imagesLength * 0.5, imagesLength * 0.75);
          const group4 = images.slice(imagesLength * 0.75);
          this.images = [group1, group2, group3, group4];
        } else {
          const group1 = [];
          const group2 = [];
          const group3 = [];
          const group4 = [];
          this.images = [group1, group2, group3, group4];
        }
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
