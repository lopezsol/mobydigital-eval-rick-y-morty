import { Component, computed, input, output } from '@angular/core';
import type { PaginationInfo } from '@characters/interfaces/pagination-info.interface';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent {
  $infoPagination = input.required<PaginationInfo>();
  $currentPage = input.required<number>();
  $pageChanged = output<number>();

  visiblePages = computed(() => {
    const totalPages = this.$infoPagination().pages;
    const current = this.$currentPage();

    let start = Math.max(current - 1, 1);
    let end = Math.min(start + 2, totalPages);

    start = Math.max(end - 2, 1);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  goToPage(page: number) {
    this.$pageChanged.emit(page);
  }

  goToNextPage() {
    if (this.$currentPage() < this.$infoPagination().pages) {
      this.$pageChanged.emit(this.$currentPage() + 1);
    }
  }

  goToPrevPage() {
    if (this.$currentPage() > 1) {
      this.$pageChanged.emit(this.$currentPage() - 1);
    }
  }
}
