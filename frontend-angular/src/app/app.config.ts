import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // GitHub Pages is static hosting and does not rewrite `/about` -> `/index.html`,
    // so hash routing avoids 404s for deep links.
    provideRouter(routes, withHashLocation()),
    provideHttpClient(),
    provideAnimationsAsync()
  ]
};
