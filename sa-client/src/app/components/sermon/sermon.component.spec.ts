import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SermonComponent } from './sermon.component';

describe('SermonComponent', () => {
  let component: SermonComponent;
  let fixture: ComponentFixture<SermonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SermonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SermonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
