import {Component, Input, OnInit} from '@angular/core';
import {Community} from '../../../models/community';

@Component({
  selector: 'app-up-and-coming-communities',
  templateUrl: './up-and-coming-communities.component.html',
  styleUrls: ['./up-and-coming-communities.component.scss']
})
export class UpAndComingCommunitiesComponent implements OnInit {

  @Input()
  communities: Community[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

}
