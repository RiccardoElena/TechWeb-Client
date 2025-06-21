import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentCloseUpComponent } from './comment-close-up.component';

describe('CommentCloseUpComponent', () => {
  let component: CommentCloseUpComponent;
  let fixture: ComponentFixture<CommentCloseUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentCloseUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentCloseUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
