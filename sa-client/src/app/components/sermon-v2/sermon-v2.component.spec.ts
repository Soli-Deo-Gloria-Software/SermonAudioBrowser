import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SermonV2Component } from './sermon-v2.component';

describe('SermonV2Component', () => {
  let component: SermonV2Component;
  let fixture: ComponentFixture<SermonV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SermonV2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SermonV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
