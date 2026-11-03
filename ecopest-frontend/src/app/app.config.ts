import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/authinterceptor';
import { Authservice } from './services/authservice';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Paginatorintl } from './i18n/paginatorintl';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    { provide: MatPaginatorIntl, useClass: Paginatorintl },
    provideAppInitializer(() => inject(Authservice).init()),
  ],
};
