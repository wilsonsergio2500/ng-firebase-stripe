
import { LoadingButton } from './loading-button.component';
import { LoadingButtonBusyComponent } from './busy/busy.component';
import { LoadingButtonReady } from './ready/ready.component';

export function getComponents() {
  return [
    LoadingButton,
    LoadingButtonBusyComponent,
    LoadingButtonReady
  ];

}
