import { test, expect } from '../../fixtures/pages.fixture';

test.describe('Request Loan', () => {
  test('submits a loan request successfully', async ({ requestLoanPage }) => {
    await requestLoanPage.goto();
    // Relies on the "from account" dropdown's pre-selected default, same
    // reasoning as the Open New Account test.
    await requestLoanPage.enterLoanAmount('5000');
    await requestLoanPage.enterDownPayment('1000');
    await requestLoanPage.clickApplyNow();

    await expect(requestLoanPage.loanRequestProcessedHeading).toBeVisible();

    // Approval is a live business-rule decision based on account balances,
    // which this shared demo server's data isn't stable enough to predict -
    // asserting the request was processed either way, not a specific outcome.
    const status = await requestLoanPage.getLoanStatus();
    expect(status).toMatch(/Approved|Denied/);
  });
});
