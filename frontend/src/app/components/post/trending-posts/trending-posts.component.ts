import {Component, Input, OnInit} from '@angular/core';
import {Post} from '../../../models/post';

@Component({
  selector: 'app-trending-posts',
  templateUrl: './trending-posts.component.html',
  styleUrls: ['./trending-posts.component.scss']
})
export class TrendingPostsComponent implements OnInit {

  @Input()
  posts: Post[] = [];

  ngOnInit(): void {
  }

}
