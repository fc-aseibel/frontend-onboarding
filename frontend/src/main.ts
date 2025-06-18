import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { App } from './app/app';
import { inject, provideAppInitializer } from '@angular/core';
import { AppConfigService } from './app/services/app-config-service';

bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
    provideAppInitializer(() => {
      const cfg = inject(AppConfigService);
      return cfg.loadConfig();
    }),
  ],

})
  .catch(err => console.error(err));