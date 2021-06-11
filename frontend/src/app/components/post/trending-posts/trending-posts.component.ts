import {Component, OnInit} from '@angular/core';
import {Post} from '../../../domain/post/post';
import {PostService} from '../../../domain/post/post.service';

@Component({
  selector: 'app-trending-posts',
  templateUrl: './trending-posts.component.html',
  styleUrls: ['./trending-posts.component.scss']
})
export class TrendingPostsComponent implements OnInit {

  posts: Post[] = [];

  private postService: PostService;

  constructor(postService: PostService) {
    this.postService = postService;
  }

  ngOnInit(): void {
    this.postService.fetchTrending()
      .subscribe(([posts, page]) => {
        this.posts = posts;
      });
  }

}
