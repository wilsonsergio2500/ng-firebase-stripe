import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'loading-signal',
  templateUrl: 'loading-signal.component.html',
  styleUrls: [`loading-signal.component.scss`]
})
export class LoadingSignalComponent {

  private _asOverlay = false;

  @HostBinding('class.loading-as-overlay')
  @Input()
  get asOverlay() { return this._asOverlay; }
  set asOverlay(value: BooleanInput) {
    this._asOverlay = coerceBooleanProperty(value);
  }

  @Input() diameter = 30;
  @Input() strokeWidth = 2

}
