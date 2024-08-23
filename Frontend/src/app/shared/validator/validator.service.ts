import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidatorService {
  constructor() {}

  iqualsPassword(campo1: string, campo2: string) {

    return (FormGroup: AbstractControl): ValidationErrors | null => {

      const pass1 = FormGroup.get(campo1)?.value;
      const pass2 = FormGroup.get(campo2)?.value;

      if (pass1 !== pass2) {
        FormGroup.get(campo2)?.setErrors({ noIguales: true });
        return { noIguales: true };
      }
      
      FormGroup.get(campo2)?.setErrors(null);
      return null;
    };
  }
}
