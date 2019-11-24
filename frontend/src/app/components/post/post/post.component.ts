import {Component, Input, OnInit} from '@angular/core';
import {Post} from '../../../models/post';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input()
  public post: Post;
  @Input()
  public showCommunity: boolean = true;

  ngOnInit(): void {

  }

  public showMask(content: string): boolean {
    return !(content.includes('video') || content.includes('image'));
  }

}
