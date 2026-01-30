import { Component, Output, EventEmitter } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-offer',
  standalone: true,
  imports: [NzCardModule, NzCollapseModule, FormsModule, CommonModule],
  templateUrl: './product-offer.component.html',
  styleUrl: './product-offer.component.css'
})
export class ProductOfferComponent {
  @Output() formData = new EventEmitter<{ 
    productOfferData: any; 
    isValid: boolean 
  }>();

  panel = {
    active: true,
    name: 'Current product account offer',
    disabled: false,
  };

  // Sample product offers data
  productOffers = [
    { id: 'offer1', name: 'Business Premium Account', description: 'Higher transaction limits, dedicated support', selected: false },
    { id: 'offer2', name: 'Standard Business Account', description: 'Standard features for growing businesses', selected: false },
    { id: 'offer3', name: 'Startup Essentials', description: 'Low fees, ideal for new businesses', selected: false },
    { id: 'offer4', name: 'Enterprise Solution', description: 'Custom solutions for large businesses', selected: false }
  ];

  selectedOffer: string | null = null;
  acceptedTerms = false;

  updateForm() {
    const isValid = this.isFormValid();
    const productOfferData = {
      selectedOffer: this.selectedOffer,
      acceptedTerms: this.acceptedTerms,
      offers: this.productOffers
    };

    this.formData.emit({
      productOfferData,
      isValid
    });
  }

  selectOffer(offerId: string) {
    this.selectedOffer = offerId;
    this.updateForm();
  }

  toggleTerms() {
    this.acceptedTerms = !this.acceptedTerms;
    this.updateForm();
  }

  isFormValid(): boolean {
    return this.selectedOffer !== null && this.acceptedTerms;
  }
}