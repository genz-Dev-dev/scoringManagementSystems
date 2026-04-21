import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules, withHashLocation } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection( { eventCoalescing: true } ),

    provideRouter(
      routes,
      withPreloading( PreloadAllModules ),
      withHashLocation()
    ),

    provideHttpClient( withFetch() ),
    provideAnimationsAsync(),
    provideAuth( () => getAuth() ),
  ],
};