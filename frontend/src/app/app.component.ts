import {Component, OnInit} from '@angular/core';
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private _mobile: boolean = false;
  private _title: string = 'DevNews';

  constructor(public _breakpointObserver: BreakpointObserver) {
  }

  ngOnInit(): void {
    this._breakpointObserver.observe(['(min-width: 720px)']).subscribe((state: BreakpointState) => {
      this._mobile = state.matches;
    });
  }

  public isMobile(): boolean {
    return this._mobile;
  }

}
