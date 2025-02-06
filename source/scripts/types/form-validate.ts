import {ContactInfo} from './contact';

export interface FormValidate {
  inputs: HTMLInputElement[];
  storage: ContactInfo[];
  errorMessage: HTMLElement;
}
