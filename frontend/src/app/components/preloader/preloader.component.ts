import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-preloader',
  templateUrl: './preloader.component.html',
  styleUrls: ['./preloader.component.scss']
})
export class PreloaderComponent implements OnInit {
  private _preloading: boolean = false;
  @Input() timeout: number = 10000;

  ngOnInit(): void {
    this.preloading = true;
    setInterval(() => this.preloading = false, this.timeout);
  }

  get preloading(): boolean {
    return this._preloading;
  }

  set preloading(value: boolean) {
    this._preloading = value;
  }
}
