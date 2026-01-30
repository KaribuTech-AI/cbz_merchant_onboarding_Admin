import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
// import { OtpService } from '../../services/otp.service';

@Component({
  selector: 'app-captcha',
  standalone: true,
  imports: [CommonModule, FormsModule, NzInputModule, NzButtonModule],
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.css']
})
export class CaptchaComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() title: string = "Security Verification";
  @Input() showBackButton: boolean = true;
  @Input() redirectUrl: string = '/dashboard';
  @Input() phoneNumber: string = '';

  @Output() onValidation = new EventEmitter<boolean>();
  @Output() onBack = new EventEmitter<void>();

  @ViewChild('captchaCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('captchaInput') inputRef!: ElementRef<HTMLInputElement>;

  // OTP properties
  otpValue: string = '';
  otpStage: boolean = true;
  otpLoading: boolean = false;
  resendLoading: boolean = false;
  otpError: string = '';
  otpUuid: string = ''; // New property to store the UUID

  // DUMMY OTP CONFIGURATION
  private readonly DUMMY_OTP: string = '123456'; // Temporary dummy OTP

  // CAPTCHA properties
  captchaCode: string = '';
  userInput: string = '';
  isValid: boolean = false;
  private retryCount: number = 0;
  private maxRetries: number = 3;
  private retryTimeout: any;

  constructor(
    // private otpService: OtpService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.initializeVerification();
  }

  ngAfterViewInit() {
    this.safeGenerateCaptcha();
  }

  ngOnDestroy() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  private initializeVerification(): void {
    this.sendOtpToPhone();
  }

  private sendOtpToPhone(): void {
    if (!this.phoneNumber) {
      console.error('Phone number is required for OTP');
      this.message.error('Phone number is required');
      return;
    }

    this.otpLoading = true;
    this.otpError = '';

    // TEMPORARY: Use dummy OTP instead of real service

    // Simulate API delay
    setTimeout(() => {
      // Generate a dummy UUID for consistency
      this.otpUuid = 'dummy-uuid-' + Date.now();
      this.message.success(`OTP sent Successfully`);
      this.otpError = '';
      this.otpLoading = false;
    }, 1000);

    // COMMENTED OUT ORIGINAL OTP SERVICE CALL
    /*
    this.otpService.generateOtp(this.phoneNumber).subscribe({
      next: (generateResponse) => {
        this.otpUuid = generateResponse.uuid;
        this.message.success('OTP sent successfully');
        this.otpError = '';
      },
      error: (error) => {
        console.error('Error generating OTP:', error);
        this.message.error(error.message || 'Failed to generate OTP');
        this.otpError = error.message || 'Failed to generate OTP';
      },
      complete: () => {
        this.otpLoading = false;
      }
    });
    */
  }

  verifyOtp(): void {
    // TEMPORARY: Use dummy verification instead of real service
    if (this.otpValue === this.DUMMY_OTP) {
      this.message.success('OTP verified successfully');
      this.otpStage = false;
      setTimeout(() => {
        this.safeGenerateCaptcha();
        this.inputRef?.nativeElement.focus();
      }, 100);
      return;
    }

    // If not using dummy OTP, show error
    if (this.otpValue.length !== 6) {
      this.otpError = 'Please enter a 6-digit code';
      return;
    }

    this.otpError = `Invalid OTP.`;

    // COMMENTED OUT ORIGINAL OTP VERIFICATION
    /*
    if (!this.otpUuid) {
      this.otpError = 'OTP not generated. Please try again.';
      return;
    }
    if (this.otpValue.length !== 6) {
      this.otpError = 'Please enter a 6-digit code';
      return;
    }

    this.otpLoading = true;
    this.otpError = '';
    
    this.otpService.verifyOtp(this.otpUuid, this.otpValue).subscribe({
      next: (response) => {
        this.message.success('OTP verified successfully');
        this.otpStage = false;
        setTimeout(() => {
          this.safeGenerateCaptcha();
          this.inputRef?.nativeElement.focus();
        }, 100);
      },
      error: (error) => {
        console.error('OTP verification failed:', error);
        this.otpError = error.message || 'Invalid OTP. Please try again.';
      },
      complete: () => {
        this.otpLoading = false;
      }
    });
    */
  }

  resendOtp(): void {
    this.resendLoading = true;
    this.otpValue = '';
    this.otpError = '';

    // TEMPORARY: Use dummy resend instead of real service

    setTimeout(() => {
      this.otpUuid = 'dummy-uuid-resend-' + Date.now();
      this.message.success(`OTP sent Successfully`);
      this.otpError = '';
      this.resendLoading = false;
    }, 1000);

    // COMMENTED OUT ORIGINAL OTP RESEND
    /*
    this.otpService.generateOtp(this.phoneNumber).subscribe({
      next: (generateResponse) => {
        this.otpUuid = generateResponse.uuid;
        this.message.success('New OTP sent successfully');
        this.otpError = '';
      },
      error: (error) => {
        console.error('Error generating new OTP:', error);
        this.message.error(error.message || 'Failed to generate new OTP');
        this.otpError = error.message || 'Failed to generate new OTP';
      },
      complete: () => {
        this.resendLoading = false;
      }
    });
    */
  }

  // CAPTCHA Methods (unchanged - remain client-side)
  private safeGenerateCaptcha(): void {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }

    if (!this.canvasRef?.nativeElement) {
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.warn(`Canvas element not ready, retrying captcha drawing... (attempt ${this.retryCount})`);
        this.retryTimeout = setTimeout(() => this.safeGenerateCaptcha(), 100);
        return;
      } else {
        console.error('Failed to initialize canvas after multiple attempts');
        return;
      }
    }

    this.retryCount = 0;
    this.generateNewCaptcha();
  }

  private generateCaptchaCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array(5).fill(0)
      .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
      .join('');
  }

  generateNewCaptcha(): void {
    this.captchaCode = this.generateCaptchaCode();
    this.userInput = '';
    this.isValid = false;

    if (this.canvasRef?.nativeElement) {
      const canvas = this.canvasRef.nativeElement;
      canvas.width = 200;
      canvas.height = 70;
      this.drawCaptcha(this.captchaCode);
    } else {
      console.error('Canvas element not available for drawing');
    }
  }

  private drawCaptcha(code: string): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100}, 0.5)`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < code.length; i++) {
      ctx.save();
      const x = 30 + (i * 35);
      const y = 35 + (Math.random() - 0.5) * 10;

      ctx.translate(x, y);
      ctx.rotate((Math.random() - 0.5) * 0.4);
      ctx.fillStyle = `rgb(${Math.floor(20 + Math.random() * 80)}, ${Math.floor(20 + Math.random() * 80)}, ${Math.floor(20 + Math.random() * 80)})`;

      ctx.fillText(code[i], 0, 0);
      ctx.restore();
    }

    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }

  validateCaptcha(input: string): boolean {
    this.isValid = input.toUpperCase() === this.captchaCode;
    return this.isValid;
  }

  getMaskedPhoneNumber(): string {
    if (!this.phoneNumber || this.phoneNumber.length < 5) {
      return this.phoneNumber;
    }
    const len = this.phoneNumber.length;
    // Show the first 4 and the last 3 digits, masking the rest
    const start = this.phoneNumber.substring(0, 4);
    const end = this.phoneNumber.substring(len - 2);
    const mask = '*'.repeat(len - 8);
    return `${start}${mask}${end}`;
  }

  handleInputChange(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    this.userInput = input;

    if (input.length === this.captchaCode.length) {
      this.validateCaptcha(input);
    } else {
      this.isValid = false;
    }
  }

  handleVerify(): void {
    if (this.isValid) {
      this.message.success('CAPTCHA verification successful!');
      this.onValidation.emit(true);
    }
  }

  handleBack(): void {
    this.onBack.emit();
  }

  goBackToOtp(): void {
    this.otpStage = true;
    this.userInput = '';
    this.isValid = false;
    this.otpValue = '';
    this.otpError = '';
  }
}