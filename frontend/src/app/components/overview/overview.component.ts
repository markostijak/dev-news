import {Component, Input} from '@angular/core';
import {DialogService} from '../../services/dialog/dialog.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent {

  @Input()
  private title: string;

  private _dialogService: DialogService;

  constructor(dialogService: DialogService) {
    this._dialogService = dialogService;
  }

  public showDialog(which: string): void {
    this._dialogService.show(which);
  }

}
