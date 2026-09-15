import { Page } from '@playwright/test';
import { NavigationMenu } from './components/navigation-menu.component';

// Base for pages that only exist behind login (everything except LoginPage).
// Holds `page` and the shared #leftPanel nav so neither is redeclared on
// every subclass.
export abstract class AuthenticatedBasePage {
  readonly nav: NavigationMenu;

  constructor(protected readonly page: Page) {
    this.nav = new NavigationMenu(page);
  }
}
