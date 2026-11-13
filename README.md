# ParaBank Test Automation Framework

A Playwright test automation project covering both the **REST API** and the **UI** of [ParaBank](https://parabank.parasoft.com/parabank/index.htm) — Parasoft's public demo banking application. Built with TypeScript, following the Page Object Model on the UI side and a thin API-client pattern on the API side.

---

## Tech Stack

- [Playwright Test](https://playwright.dev/) — test runner, browser automation, and API request client
- TypeScript
- `dotenv` — loads environment variables from a local `.env` file

---

## Prerequisites

- Node.js (LTS recommended)
- npm

---

## Installation

```bash
npm install
npx playwright install
```

The second command downloads the browsers Playwright needs (Chromium, Firefox, WebKit) — required once after installing dependencies.

---

## Environment Setup

This project reads its configuration from a `.env` file in the project root. It is **not committed to git** (see `.gitignore`), so you need to create it yourself:

```
BASE_URL=https://parabank.parasoft.com
USERNAME=john
PASSWORD=demo
```

- **`BASE_URL`** — the root of the ParaBank application under test. Loaded in `playwright.config.ts` and used as Playwright's `baseURL`, so every test and page object can use short relative paths instead of hardcoding the full domain.
- **`USERNAME` / `PASSWORD`** — login credentials for the ParaBank demo account. Every API and UI test that needs to be logged in reads these two values — there are no credentials hardcoded anywhere else in the project.

If `.env` is missing, tests that log in will fail immediately with an obvious error, since `process.env.USERNAME`/`PASSWORD` will be empty.

> **Note for CI:** the GitHub Actions workflow (`.github/workflows/playwright.yml`) runs the suite but does not currently define `BASE_URL`/`USERNAME`/`PASSWORD` as repository secrets. Add those before relying on CI runs to pass.

---

## Project Structure

```
api/
  clients/     API client classes (one per domain: Auth, Account, Transfer)
  models/      TypeScript interfaces for API response shapes

pages/
  components/  Reusable UI pieces shared across pages (e.g. the nav menu)
  *.page.ts    One Page Object per screen (Login, Open New Account, ...)

fixtures/
  pages.fixture.ts   Wires Page Objects (and an auto-login step) into Playwright's test runner

tests/
  api/        API-level tests
  ui/         UI-level tests, driven through the Page Objects
```

---

## Design Principles

- **API clients are thin.** Each client (`AuthClient`, `AccountClient`, `TransferClient`) only builds the request and returns Playwright's raw `APIResponse`. Parsing the body and asserting on it happens in the test, not the client.
- **Page Objects only contain locators and interaction methods — never assertions.** A page object can tell you _what's on the page_ and _how to interact with it_; whether that's correct is the test's job.
- **Locators prefer `getByRole`, falling back to attribute/CSS selectors only where the app has no accessible name to use.** ParaBank's forms don't use `<label>` elements anywhere, so most text inputs and dropdowns fall back to attribute selectors — this is called out with a comment at each such locator, so it reads as a deliberate choice, not an oversight.
- **Fixtures remove repeated setup from tests.** `fixtures/pages.fixture.ts` extends Playwright's `test` so tests can ask for `loginPage`, `transferFundsPage`, etc. directly instead of constructing them, and an `authenticatedPage` fixture logs in once automatically for any test that needs a logged-in session.

---

## Running Tests

```bash
npx playwright test                      # everything
npx playwright test tests/api            # API tests only
npx playwright test tests/ui             # UI tests only
npx playwright test --project=chromium   # restrict to one browser
npx playwright test --ui                 # interactive UI Mode
npx playwright show-report                # view the last HTML report
```

Only the `chromium` project is currently enabled in `playwright.config.ts` (Firefox/WebKit are present but commented out). These are functional API/UI tests, not cross-browser rendering tests, so running the same suite three times over for no extra signal was intentionally avoided.

---

## Test Coverage

### API tests (`tests/api`)

| File               | Covers                                                                 |
| ------------------ | ---------------------------------------------------------------------- |
| `auth.spec.ts`     | Successful login; invalid username rejected; invalid password rejected |
| `account.spec.ts`  | Get a customer's accounts; get details for a single account            |
| `transfer.spec.ts` | Successful transfer between two accounts                               |

### UI tests (`tests/ui`)

| File                          | Covers                                               |
| ----------------------------- | ---------------------------------------------------- |
| `login.spec.ts`               | Successful login; invalid credentials show an error  |
| `open-new-account.spec.ts`    | Opens a new checking account successfully            |
| `transfer-funds.spec.ts`      | Transfers funds between two accounts                 |
| `update-contact-info.spec.ts` | Updates the customer's profile successfully          |
| `request-loan.spec.ts`        | Submits a loan request and confirms it was processed |

---

## Important Notes

This suite runs against ParaBank's **live public demo server**, not an isolated test environment built for this project. That has real consequences worth knowing about:

- **Shared data.** Account balances and account counts can change between runs, since other people and other automated suites use the same public demo credentials.
- **Rate limiting.** The server can return `429 Too Many Requests` if hit with too many test runs in a short window.
- **Occasional server errors.** The demo has, on occasion, returned `500` errors or rejected normally-valid credentials — outside this project's control.

To stay reliable despite this, the tests avoid hardcoding account IDs where possible (reading real ones from the app at runtime instead) and avoid asserting on outcomes that depend on live, changeable data — for example, the loan request test checks that a decision was reached, not which one, since approval depends on live account balances.
