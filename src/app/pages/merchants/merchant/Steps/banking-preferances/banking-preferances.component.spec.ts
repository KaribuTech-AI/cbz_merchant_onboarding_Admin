import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankingPreferancesComponent } from './banking-preferances.component';

describe('BankingPreferancesComponent', () => {
  let component: BankingPreferancesComponent;
  let fixture: ComponentFixture<BankingPreferancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankingPreferancesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankingPreferancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
