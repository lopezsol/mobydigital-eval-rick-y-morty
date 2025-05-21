import { Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'character-search',
  imports: [ReactiveFormsModule],
  templateUrl: './character-search.component.html',
  styleUrl: './character-search.component.css',
})
export class CharacterSearchComponent {
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
