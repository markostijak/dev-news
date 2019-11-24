import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, NgForm} from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  value = 'Clear me';

  @Output()
  private search: EventEmitter<string> = new EventEmitter<string>();

  private _searchInput: FormControl = new FormControl();

  constructor() {
  }

  ngOnInit(): void {
  }

  onSubmit($event: NgForm): void {
    const value = this._searchInput.value;
    if (value && value.length > 2) {
      this.search.emit(value);
    }
  }

  get searchInput(): FormControl {
    return this._searchInput;
  }
}
