import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { AuthLogoutAction } from '../../states/auth/auth.actions';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  title = 'FireNgStripe';

  mobileQuery: MediaQueryList;

  constructor(
    private store: Store,
    private media: MediaMatcher,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this.mobileQuery.addListener(this.mobileQueryListener.bind(this));
  }

  mobileQueryListener() {
    this.changeDetectorRef.detectChanges();
  }
  ngOnDestroy() {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }
  logout() {
    this.store.dispatch(new AuthLogoutAction());
  }
}
