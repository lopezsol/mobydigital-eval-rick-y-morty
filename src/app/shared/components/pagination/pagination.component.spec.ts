import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';
import { PaginationInfo } from '@characters/interfaces/pagination-info.interface';

describe('PaginationComponent', () => {
  let fixture: ComponentFixture<PaginationComponent>;
  let component: PaginationComponent;

  const mockPaginationInfo: PaginationInfo = {
    pages: 5,
    count: 100,
    next: null,
    prev: null,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate visiblePages correctly for middle page', () => {
    fixture.componentRef.setInput('$infoPagination', mockPaginationInfo);
    fixture.componentRef.setInput('$currentPage', 3);
    fixture.detectChanges();

    expect(component.visiblePages()).toEqual([2, 3, 4]);
  });

  it('should calculate visiblePages correctly for first page', () => {
    fixture.componentRef.setInput('$infoPagination', mockPaginationInfo);
    fixture.componentRef.setInput('$currentPage', 1);
    fixture.detectChanges();

    expect(component.visiblePages()).toEqual([1, 2, 3]);
  });

  it('should calculate visiblePages correctly for last page', () => {
    fixture.componentRef.setInput('$infoPagination', mockPaginationInfo);
    fixture.componentRef.setInput('$currentPage', 5);
    fixture.detectChanges();

    expect(component.visiblePages()).toEqual([3, 4, 5]);
  });

  it('should emit the selected page when goToPage is called', () => {
    spyOn(component.$pageChanged, 'emit');

    component.goToPage(4);

    expect(component.$pageChanged.emit).toHaveBeenCalledWith(4);
  });

  it('should go to next page when not on last page', () => {
    fixture.componentRef.setInput('$infoPagination', mockPaginationInfo);
    fixture.componentRef.setInput('$currentPage', 2);
    fixture.detectChanges();

    spyOn(component.$pageChanged, 'emit');

    component.goToNextPage();

    expect(component.$pageChanged.emit).toHaveBeenCalledWith(3);
  });

  it('should not emit next page if already on last page', () => {
    fixture.componentRef.setInput('$infoPagination', mockPaginationInfo);
    fixture.componentRef.setInput('$currentPage', 5);
    fixture.detectChanges();

    spyOn(component.$pageChanged, 'emit');

    component.goToNextPage();

    expect(component.$pageChanged.emit).not.toHaveBeenCalled();
  });

  it('should go to previous page when not on first page', () => {
    fixture.componentRef.setInput('$infoPagination', mockPaginationInfo);
    fixture.componentRef.setInput('$currentPage', 3);
    fixture.detectChanges();

    spyOn(component.$pageChanged, 'emit');

    component.goToPrevPage();

    expect(component.$pageChanged.emit).toHaveBeenCalledWith(2);
  });

  it('should not emit previous page if already on first page', () => {
    fixture.componentRef.setInput('$infoPagination', mockPaginationInfo);
    fixture.componentRef.setInput('$currentPage', 1);
    fixture.detectChanges();

    spyOn(component.$pageChanged, 'emit');

    component.goToPrevPage();

    expect(component.$pageChanged.emit).not.toHaveBeenCalled();
  });
});
