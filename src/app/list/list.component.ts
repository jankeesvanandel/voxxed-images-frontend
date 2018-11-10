import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SpeakersService } from '../speakers.service';
import { Speaker } from '../model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  voxxians: Speaker[];

  constructor(private httpClient: HttpClient, private speakersService: SpeakersService) {
  }

  ngOnInit() {
    this.speakersService.get().subscribe(speakers => {
      this.voxxians = speakers;
    });
  }

}
