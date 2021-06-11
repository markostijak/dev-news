import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {State} from '../../domain/state';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  state: State;

  private router: Router;

  constructor(state: State, router: Router) {
    this.state = state;
    this.router = router;
  }

  ngOnInit(): void {
  }

  public onSearch($event): void {
    this.router.navigate(['/search'], {
      queryParams: {
        term: $event
      }
    });
  }

}
