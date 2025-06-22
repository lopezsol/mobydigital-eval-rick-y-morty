import { Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  $query = input<string>('');
  $queryChanged = output<string>();
  searchControl = new FormControl();

  ngOnInit() {
    this.searchControl.setValue(this.$query());
  }

  onSearch(event: Event) {
    event.preventDefault();
    const value = this.searchControl.value?.trim();
    this.$queryChanged.emit(value);
  }
}
