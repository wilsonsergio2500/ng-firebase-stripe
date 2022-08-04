
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FIREBASE_STATE_CONFIG, INgxsStateHelperModuleConfig } from './tokens/firebase-state-config.token';
import { AngularFireStorageModule } from '@angular/fire/storage';

@NgModule({
  imports: [
    CommonModule,
    AngularFireStorageModule
  ],
})
export class NgxsFirebaseStateHelperModule {
  public static forRoot(options?: INgxsStateHelperModuleConfig): ModuleWithProviders<NgxsFirebaseStateHelperModule> {
    return {
      ngModule: NgxsFirebaseStateHelperModule,
      providers: [
        { provide: FIREBASE_STATE_CONFIG, useValue: options || <INgxsStateHelperModuleConfig>{ loggerOn: false } }
      ]
      
    }
  }
}
