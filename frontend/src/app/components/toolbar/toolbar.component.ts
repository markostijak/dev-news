import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../services/user/user.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  router: Router;
  userService: UserService;

  constructor(router: Router, userService: UserService) {
    this.router = router;
    this.userService = userService;
  }

  ngOnInit(): void {
  }

  public onSearch($event): void {
    this.router.navigate(['/search'], {
      queryParams: {
        term: $event
      }
    });
  }

}
