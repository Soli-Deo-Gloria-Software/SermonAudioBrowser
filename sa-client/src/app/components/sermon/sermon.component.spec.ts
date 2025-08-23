import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SermonComponent } from './sermon.component';

describe('SermonComponent', () => {
  let component: SermonComponent;
  let fixture: ComponentFixture<SermonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SermonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SermonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
