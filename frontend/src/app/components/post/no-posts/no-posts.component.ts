import {Component, Input} from '@angular/core';
import {DialogService} from '../../../services/dialog/dialog.service';

@Component({
  selector: 'app-no-posts',
  templateUrl: './no-posts.component.html',
  styleUrls: ['./no-posts.component.scss']
})
export class NoPostsComponent {

  @Input()
  public showCreateCommunity: boolean = true;

  private _dialogService: DialogService;

  constructor(dialogService: DialogService) {
    this._dialogService = dialogService;
  }

  public showDialog(which: string): void {
    this._dialogService.show(which);
  }

}
