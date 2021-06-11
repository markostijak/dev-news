import {Component, Input} from '@angular/core';
import {DialogService} from '../../../domain/utils/dialog.service';

@Component({
  selector: 'app-no-posts',
  templateUrl: './no-posts.component.html',
  styleUrls: ['./no-posts.component.scss']
})
export class NoPostsComponent {

  @Input()
  public showCreateCommunity: boolean = true;

  private dialogService: DialogService;

  constructor(dialogService: DialogService) {
    this.dialogService = dialogService;
  }

  public showDialog(which: string): void {
    this.dialogService.show(which);
  }

}
