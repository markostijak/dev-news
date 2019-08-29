import {Component, OnInit} from '@angular/core';
import {Community} from '../../models/community';
import {NavigationService} from '../../services/navigation/navigation.service';

@Component({
  selector: 'app-community-view',
  templateUrl: './community-view.component.html',
  styleUrls: ['./community-view.component.scss']
})
export class CommunityViewComponent implements OnInit {

  private _community: Community;
  private _navigationService: NavigationService;

  constructor(navigationService: NavigationService) {
    this._navigationService = navigationService;
  }

  ngOnInit(): void {
    this._navigationService.navigate({
      title: 'Java',
      route: 'c/Java',
      logo: 'https://cdn1.iconfinder.com/data/icons/system-shade-circles/512/java-512.png'
    });
  }

}
