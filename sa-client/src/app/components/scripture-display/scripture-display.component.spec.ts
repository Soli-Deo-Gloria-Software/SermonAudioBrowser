import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptureDisplayComponent } from './scripture-display.component';

describe('ScriptureDisplayComponent', () => {
  let component: ScriptureDisplayComponent;
  let fixture: ComponentFixture<ScriptureDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScriptureDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScriptureDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
