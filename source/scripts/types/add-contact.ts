import {ContactInfo} from './contact';

export interface AddContactParams {
  contact: ContactInfo;
  letterElement: HTMLElement;
  shouldSave?: boolean;
}
