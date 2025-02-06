import {Error} from './error';

export interface Validate {
  isValid: boolean;
  errors: Error[];
}
