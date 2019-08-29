import {Component, OnInit} from '@angular/core';
import {NavigationService, POPULAR} from '../../services/navigation/navigation.service';

@Component({
  selector: 'app-popular-view',
  templateUrl: './popular-view.component.html',
  styleUrls: ['./popular-view.component.scss']
})
export class PopularViewComponent implements OnInit {

  private _navigationService: NavigationService;

  constructor(navigationService: NavigationService) {
    this._navigationService = navigationService;
  }

  ngOnInit(): void {
    this._navigationService.navigate(POPULAR);
  }

}
