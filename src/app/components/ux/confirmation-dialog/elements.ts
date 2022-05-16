import { ConfirmationModalComponent } from './modal/confirmation-modal.component';
import { ConfirmationDialogService } from './confirmation-dialog.service';

export function getComponents() {
  return [
    ConfirmationModalComponent
  ];
}

export function getProviders() {
  return [
    ConfirmationDialogService
  ]
}
