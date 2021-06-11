import {Component} from '@angular/core';
import {State} from '../../domain/state';

@Component({
  selector: 'app-index-view',
  templateUrl: './index-view.component.html',
  styleUrls: ['./index-view.component.scss']
})
export class IndexViewComponent {

  state: State;

  constructor(state: State) {
    this.state = state;
  }

}
