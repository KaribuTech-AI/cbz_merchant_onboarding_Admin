import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsOfOwnershipComponent } from './forms-of-ownership.component';

describe('FormsOfOwnershipComponent', () => {
  let component: FormsOfOwnershipComponent;
  let fixture: ComponentFixture<FormsOfOwnershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsOfOwnershipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormsOfOwnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
