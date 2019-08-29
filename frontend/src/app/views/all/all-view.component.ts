import {Component, OnInit} from '@angular/core';
import {ALL, NavigationService} from '../../services/navigation/navigation.service';

@Component({
  selector: 'app-all-view',
  templateUrl: './all-view.component.html',
  styleUrls: ['./all-view.component.scss']
})
export class AllViewComponent implements OnInit {

  private _navigationService: NavigationService;

  constructor(navigationService: NavigationService) {
    this._navigationService = navigationService;
  }

  ngOnInit(): void {
    this._navigationService.navigate(ALL);
  }

}
