import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function openActivity(page: Page, title: string) {
  await page.goto('/demo/fnp-skill-1');
  await page
    .getByRole('navigation', { name: 'Module sections' })
    .getByRole('button', { name: 'Activities', exact: true })
    .click();
  await page
    .locator('.activity-choice')
    .filter({ has: page.getByRole('heading', { name: title, exact: true }) })
    .getByRole('button', { name: 'Start activity' })
    .click();
}

test('home, dashboard, search, bookmarks, and direct links work', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Good things start with practice.' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Start learning', exact: true }).click();
  await expect(page.locator('.skill-card')).toHaveCount(3);
  await page.getByRole('button', { name: 'Save FNP Skill 2', exact: true }).click();
  await page.goto('/saved');
  await expect(page.locator('.skill-card')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'FNP Skill 2' })).toBeVisible();
  await page.getByRole('button', { name: 'Unsave FNP Skill 2' }).click();
  await expect(page.getByRole('heading', { name: 'Keep your next step close.' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Search learning resources' }).fill('FNP Skill 3');
  await page
    .locator('.search-results')
    .getByRole('link', { name: /FNP Skill 3/ })
    .click();
  await expect(page.getByRole('heading', { name: 'FNP Skill 3', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText('Awaiting clinical validation', { exact: true })).toBeVisible();
});

test('clinical routes never render draft instructions and approved filter is honest', async ({
  page,
}) => {
  await page.goto('/modules');
  await page.getByRole('button', { name: 'Approved', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'No modules here just yet.' })).toBeVisible();
  await page.getByRole('button', { name: 'Show all modules' }).click();
  await page.getByRole('link', { name: 'Explore module' }).first().click();
  for (const name of ['Procedural guide', 'Demonstration', 'Activities', 'My results']) {
    await page
      .getByRole('navigation', { name: 'Module sections' })
      .getByRole('button', { name, exact: true })
      .click();
    await expect(page.getByText('Awaiting clinical validation', { exact: true })).toBeVisible();
    await expect(page.locator('.sequence-list, .question-fieldset')).toHaveCount(0);
  }
});

test('sequencing supports move controls, correct scoring, explanations, retry, and persistence', async ({
  page,
}) => {
  await openActivity(page, 'Arrange the steps');
  const order = [
    'Read the learning objectives.',
    'Review the guide and its explanations.',
    'Complete a practice activity.',
    'Read your feedback and revisit the guide.',
  ];
  for (let target = 0; target < order.length; target++) {
    const row = page.locator('.sequence-row').filter({ hasText: order[target] });
    let current = (await page.locator('.step-text').allTextContents()).indexOf(order[target]);
    while (current > target) {
      await row.getByRole('button', { name: /up$/ }).focus();
      await page.keyboard.press('Enter');
      current--;
    }
  }
  await page.getByRole('button', { name: 'Submit answer', exact: true }).click();
  await expect(page.locator('.score-line')).toContainText('100%');
  await expect(page.locator('.review-card.correct')).toHaveCount(4);
  await expect(page.locator('.review-body').first()).toContainText('Objectives help you');
  await page.getByRole('button', { name: 'Retry activity' }).click();
  await expect(page.locator('.sequence-row')).toHaveCount(4);
  expect(await page.locator('.step-text').allTextContents()).not.toEqual(order);
  await page.reload();
  await page.getByRole('button', { name: 'My results', exact: true }).click();
  await expect(page.locator('.saved-results')).toContainText('100%');
  await page.goto('/skill/fnp-skill-1');
  await page.getByRole('button', { name: 'My results', exact: true }).click();
  await expect(page.locator('.saved-results')).toHaveCount(0);
});

test('drag and drop rearranges steps and incorrect positions receive feedback', async ({
  page,
}) => {
  await openActivity(page, 'Arrange the steps');
  const before = await page.locator('.step-text').allTextContents();
  const dt = await page.evaluateHandle(() => new DataTransfer());
  await page.locator('.sequence-row').first().dispatchEvent('dragstart', { dataTransfer: dt });
  await page.locator('.sequence-row').last().dispatchEvent('drop', { dataTransfer: dt });
  expect(await page.locator('.step-text').allTextContents()).toEqual([
    ...before.slice(1),
    before[0],
  ]);
  // Force one inversion via the same accessible controls so the failure path is deterministic.
  const order = [
    'Read the learning objectives.',
    'Review the guide and its explanations.',
    'Complete a practice activity.',
    'Read your feedback and revisit the guide.',
  ];
  for (let target = 0; target < order.length; target++) {
    const row = page.locator('.sequence-row').filter({ hasText: order[target] });
    let current = (await page.locator('.step-text').allTextContents()).indexOf(order[target]);
    while (current > target) {
      await row.getByRole('button', { name: /up$/ }).click();
      current--;
    }
  }
  await page.locator('.sequence-row').first().getByRole('button', { name: /down$/ }).click();
  await page.getByRole('button', { name: 'Submit answer', exact: true }).click();
  await expect(page.locator('.score-line')).toContainText('50%');
  await expect(page.locator('.review-card.incorrect')).toHaveCount(2);
  await expect(page.getByText('Correct response:', { exact: true })).toHaveCount(4);
});

test('error recognition handles incorrect and correct responses and retry', async ({ page }) => {
  await openActivity(page, 'Spot the error');
  await expect(page.getByRole('button', { name: 'Submit answer', exact: true })).toBeDisabled();
  await page.getByRole('radio', { name: /Wait for reviewed/ }).check();
  await page.getByRole('button', { name: 'Submit answer', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Let’s take another look.');
  await expect(page.getByRole('status')).toContainText('A draft has not been released');
  await page.getByRole('button', { name: 'Next scenario' }).click();
  await page.getByRole('radio', { name: /official return-demonstration grade/ }).check();
  await page.getByRole('button', { name: 'Submit answer', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('You’ve got it.');
  await page.getByRole('button', { name: 'View results' }).click();
  await expect(page.locator('.score-line')).toContainText('50%');
  await expect(page.locator('.review-card.incorrect')).toHaveCount(1);
  await page.getByRole('button', { name: 'Retry activity' }).click();
  await expect(page.locator('.question-progress')).toContainText('0 of 2 answered');
});

test('quiz navigation requires all answers and gives a complete result summary', async ({
  page,
}) => {
  await openActivity(page, 'Check your knowledge');
  await page.getByRole('button', { name: 'Question 3', exact: true }).click();
  await page.getByRole('radio', { name: /Read the explanation/ }).check();
  await page.getByRole('button', { name: 'Submit answer', exact: true }).click();
  await page.getByRole('button', { name: 'Go to unanswered' }).click();
  await expect(
    page.getByRole('heading', { name: 'What is RetDemSetGo! designed to support?' }),
  ).toBeVisible();
  await page.getByRole('radio', { name: /Independent review/ }).check();
  await page.getByRole('button', { name: 'Submit answer', exact: true }).click();
  await page.getByRole('button', { name: 'Next question' }).click();
  await page.getByRole('radio', { name: /You must use a mouse/ }).check();
  await page.getByRole('button', { name: 'Submit answer', exact: true }).click();
  await page.getByRole('button', { name: 'Next question' }).click();
  await page.getByRole('button', { name: 'View results' }).click();
  await expect(page.locator('.score-line')).toContainText('67%');
  await expect(page.locator('.review-card')).toHaveCount(3);
  await expect(page.locator('.review-card.incorrect')).toHaveCount(1);
  await expect(page.locator('.review-card.incorrect')).toContainText(
    'Move up and Move down buttons',
  );
});

test('navigation, dialog, and layouts work without horizontal page overflow', async ({
  page,
}, testInfo) => {
  for (const path of ['/', '/modules', '/guide', '/about', '/demo/fnp-skill-1']) {
    await page.goto(path);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  }
  await page.getByRole('button', { name: 'Help and privacy' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Close help' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  if (testInfo.project.name === 'mobile') {
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).not.toBeVisible();
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'My learning' })
      .click();
    await expect(page).toHaveURL('/modules');
    await expect(page.getByRole('button', { name: 'Open navigation' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  }
});

test('unavailable browser storage keeps activities usable and reports unsaved progress', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException('Storage unavailable', 'SecurityError');
    };
  });
  await page.goto('/modules');
  await page.getByRole('button', { name: 'Save FNP Skill 1', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Your browser could not save progress');
  await expect(page.getByRole('button', { name: 'Unsave FNP Skill 1' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await openActivity(page, 'Spot the error');
  await page.getByRole('radio', { name: /Treat the draft/ }).check();
  await page.getByRole('button', { name: 'Submit answer', exact: true }).click();
  await expect(page.locator('.answer-feedback')).toContainText('You’ve got it.');
});

test('local data can be cleared and corrupted storage does not crash the app', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('retdemsetgo-progress-v1', 'broken JSON');
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Save FNP Skill 1', exact: true }).click();
  await page.getByRole('button', { name: 'Help and privacy' }).click();
  page.once('dialog', (d) => d.accept());
  await page.getByRole('button', { name: 'Clear local learning data' }).click();
  await expect(page.getByRole('button', { name: 'Save FNP Skill 1', exact: true })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('retdemsetgo-progress-v1')!)),
  ).toEqual({ bookmarks: [], attempts: {} });
});

test('home and activity interfaces meet automated WCAG A/AA checks', async ({ page }) => {
  await page.goto('/');
  let scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(
    scan.violations.map((v) => ({ id: v.id, elements: v.nodes.map((n) => n.target) })),
  ).toEqual([]);
  await openActivity(page, 'Check your knowledge');
  scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(
    scan.violations.map((v) => ({ id: v.id, elements: v.nodes.map((n) => n.target) })),
  ).toEqual([]);
});
