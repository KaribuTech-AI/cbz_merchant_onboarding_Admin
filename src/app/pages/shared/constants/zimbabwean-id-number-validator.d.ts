
declare module 'zimbabwean-id-number-validator' {
    interface ValidationResult {
      isIdNumberValid: boolean;
      description: string;
    }
    
    type FormatOption = 'NO_HYPHENS' | 'HYPHEN_AFTER_DISTRICT' | 'FULL_HYPHENS';
    
    function validateIdNumber(idNumber: string, format?: FormatOption): ValidationResult;
    
    export default validateIdNumber;
  }