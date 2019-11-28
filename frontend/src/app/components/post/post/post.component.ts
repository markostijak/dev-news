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
    const json = JSON.parse(content);

    if (json.ops.length != 2) {
      return true;
    }

    return !((json.ops[0].insert.image || json.ops[0].insert.video) &&
      json.ops[1].insert === '\n');
  }

}
