import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withJsonpSupport } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { userReducer } from '../store/user/user.reducer';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    // provideClientHydration(withEventReplay()),
    provideHttpClient(withJsonpSupport()),
    provideStore({user:userReducer}),
  ]
};
