import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskComplianceComponent } from './risk-compliance.component';

describe('RiskComplianceComponent', () => {
  let component: RiskComplianceComponent;
  let fixture: ComponentFixture<RiskComplianceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskComplianceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskComplianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
