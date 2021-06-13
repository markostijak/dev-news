import {Component, OnInit} from '@angular/core';
import {State} from '../../domain/state';
import {PAGE_NOT_FOUND} from '../../domain/utils/navigation';

@Component({
  selector: 'app-not-found-view',
  templateUrl: './not-found-view.component.html',
  styleUrls: ['./not-found-view.component.scss']
})
export class NotFoundViewComponent implements OnInit {

  private state: State;

  constructor(state: State) {
    this.state = state;
  }

  ngOnInit(): void {
    this.state.navigation$.next(PAGE_NOT_FOUND);
  }

}
