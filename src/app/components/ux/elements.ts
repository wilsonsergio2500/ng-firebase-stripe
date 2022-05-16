import { CheckAnimationComponent } from './check-animation/check-animation.component';
import { getComponents as getConfirmationDialogComponents, getProviders as getConfirmationDialogProviders } from './confirmation-dialog/elements';
import { getComponents as getLoadingButtonComponents } from './loading-button/elements';
import { LoadingSignalComponent } from './loading-signal/loading-signal.component';
import { getComponents as getSnackBarComponents, getProviders as getSnackBarProviders } from './snackbar-status/elements';


export function getComponents() {
  return [
    CheckAnimationComponent,
    ...getConfirmationDialogComponents(),
    ...getLoadingButtonComponents(),
    ...getSnackBarComponents(),
    LoadingSignalComponent
  ];
}

export function getProviders() {
  return [
    ...getConfirmationDialogProviders(),
    ...getSnackBarProviders(),
    LoadingSignalComponent
  ];
}

