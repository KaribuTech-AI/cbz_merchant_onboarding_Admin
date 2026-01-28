import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosTerminalsComponent } from './pos-terminals.component';

describe('PosTerminalsComponent', () => {
  let component: PosTerminalsComponent;
  let fixture: ComponentFixture<PosTerminalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosTerminalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosTerminalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
