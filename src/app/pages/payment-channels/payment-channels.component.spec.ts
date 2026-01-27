import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentChannelsComponent } from './payment-channels.component';

describe('PaymentChannelsComponent', () => {
  let component: PaymentChannelsComponent;
  let fixture: ComponentFixture<PaymentChannelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentChannelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentChannelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
