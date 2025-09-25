import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';

import { routes } from './app.routes';
import { icons } from './icons-provider';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptor } from './core/interceptors/http.interceptor';
import { provideEnvironmentNgxCurrency, NgxCurrencyInputMode } from 'ngx-currency';


registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, withPreloading(PreloadAllModules)), 
    provideNzIcons(icons), 
    provideNzI18n(en_US), 
    importProvidersFrom(FormsModule), 
    provideAnimationsAsync(), 
    provideHttpClient(withInterceptors([httpInterceptor])),
    // provideEnvironmentNgxCurrency({
    //   align: "left",
    //   allowNegative: true,
    //   allowZero: true,
    //   decimal: ".",
    //   precision: 2,
    //   prefix: "₦ ",
    //   suffix: "",
    //   thousands: ",",
    //   nullable: true,
    //   min: null,
    //   max: null,
    //   inputMode: NgxCurrencyInputMode.Financial,
    // }),
  ]
};
