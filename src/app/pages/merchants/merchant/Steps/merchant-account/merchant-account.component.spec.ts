import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantAccountComponent } from './merchant-account.component';

describe('MerchantAccountComponent', () => {
  let component: MerchantAccountComponent;
  let fixture: ComponentFixture<MerchantAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerchantAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchantAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
