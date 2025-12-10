import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

  // Enable dark mode automatically if stored
const savedDark = localStorage.getItem('darkMode');
if (savedDark === 'true') {
  document.body.classList.add('dark-theme');
}
