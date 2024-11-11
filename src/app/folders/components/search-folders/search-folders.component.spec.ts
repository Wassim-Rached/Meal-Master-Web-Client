import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFoldersComponent } from './search-folders.component';

describe('SearchFoldersComponent', () => {
  let component: SearchFoldersComponent;
  let fixture: ComponentFixture<SearchFoldersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFoldersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchFoldersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
