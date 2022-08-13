import { InjectionToken } from '@angular/core';

export interface INgxsStateHelperModuleConfig {
  loggerOn: boolean
}

export const FIREBASE_STATE_CONFIG = new InjectionToken<INgxsStateHelperModuleConfig>(
  'FIREBASE_STATE_CONFIG'
)
