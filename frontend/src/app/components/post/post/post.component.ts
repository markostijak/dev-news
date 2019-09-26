import {Component, Input, OnInit} from '@angular/core';
import {Post} from '../../../models/post';
import {TimeAgoService} from '../../../services/time-ago/time-ago.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input()
  private post: Post;
  @Input()
  private showCommunity: boolean = true;

  private readonly _timeFormatter: TimeAgoService;

  constructor(timeFormatter: TimeAgoService) {
    this._timeFormatter = timeFormatter;
  }

  ngOnInit(): void {

  }

  private showMask(content: string): boolean {
    return !(content.includes('video') || content.includes('image'));
  }

  get timeFormatter(): TimeAgoService {
    return this._timeFormatter;
  }

}
