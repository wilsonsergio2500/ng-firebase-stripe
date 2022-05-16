import { CompletedSnackbarComponent } from './types/completed/snackbar-completed.component';
import { ProgressSnackbarComponent } from './types/progress/snackbar-progress.component';
import { SnackbarStatusService } from './service/snackbar-status.service';
import { ErrorSnackbarComponent } from './types/error/snackbar-error.component';

export function getComponents() {
  return [
    CompletedSnackbarComponent,
    ProgressSnackbarComponent,
    ErrorSnackbarComponent
  ]
}

export function getProviders() {
  return [
    SnackbarStatusService
  ]
}
