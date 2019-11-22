import {Component, OnInit} from '@angular/core';
import {NavigationService, PAGE_NOT_FOUND} from '../../services/navigation/navigation.service';

@Component({
  selector: 'app-not-found-view',
  templateUrl: './not-found-view.component.html',
  styleUrls: ['./not-found-view.component.scss']
})
export class NotFoundViewComponent implements OnInit {

  private _navigationService: NavigationService;

  constructor(navigationService: NavigationService) {
    this._navigationService = navigationService;
  }

  public ngOnInit(): void {
    this._navigationService.navigate(PAGE_NOT_FOUND);
  }

}
