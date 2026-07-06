import { test, expect } from '@playwright/test';

test.describe('Cozy Task Board - Comprehensive E2E Test Suite', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the application root before each test case
    await page.goto('/');
  });

  test('should display initial empty state and page title', async ({ page }) => {
    // Assert page title matches the metadata configuration
    await expect(page).toHaveTitle(/Mini Task Board/i);

    // Verify header title is visible on loading
    const headerTitle = page.locator('h1');
    await expect(headerTitle).toBeVisible();

    // Verify stats dashboard cards are visible (Today's Journey, Total Tasks, Pending Tasks)
    await expect(page.getByText("Today's Journey", { exact: true })).toBeVisible();
    await expect(page.getByText('Tasks', { exact: true })).toBeVisible();
    await expect(page.getByText('Pending', { exact: true })).toBeVisible();
  });

  test('should enforce validation rules on task creation', async ({ page }) => {
    // Open the create task dialog
    await page.getByRole('button', { name: /create task/i }).click();

    // Verify dialog title is set to Create Task
    await expect(page.getByRole('heading', { name: 'Create Task' })).toBeVisible();

    // Attempt to submit the form with an empty title
    await page.getByRole('button', { name: 'Save' }).click();

    // Assert that client-side Zod validation message is displayed
    await expect(page.locator('text=Title is required')).toBeVisible();

    // Close the dialog using the Cancel button
    await page.getByRole('button', { name: 'Cancel' }).click();
  });

  test('should complete a full CRUD and Task Lifecycle flow', async ({ page }) => {
    const uniqueTitle = `Playwright E2E Task - ${Date.now()}`;
    const description = 'Automating the validation of task lifecycle, priority weights, and API proxying.';

    // --- 1. CREATE SCENARIO ---
    await page.getByRole('button', { name: /create task/i }).click();

    // Fill title and description inputs
    await page.locator('input#title').fill(uniqueTitle);
    await page.locator('textarea#description').fill(description);

    // Select Priority = High (Shadcn/Radix select requires click trigger then select option)
    await page.locator('button#priority').click();
    await page.getByRole('option', { name: 'High' }).click();

    // Set Due Date (Canada locale format YYYY-MM-DD input)
    await page.locator('input#dueDate').fill('2026-12-31');

    // Click Save
    await page.getByRole('button', { name: 'Save' }).click();

    // Assert success toast and list presence
    await expect(page.locator('text=Task created successfully').first()).toBeVisible();
    await expect(page.locator(`text=${uniqueTitle}`)).toBeVisible();
    
    // Locate the specific task card container we just created using an ancestor XPath traversal
    const taskCard = page.getByText(uniqueTitle).locator('xpath=./ancestor::div[contains(@class, "rounded-[1.5rem]")]');
    
    // Assert priority badge displays with icon inside our card
    await expect(taskCard.locator('text=High ⚠️')).toBeVisible();

    // --- 2. UPDATE (TOGGLE STATUS) SCENARIO ---
    // Toggle task completed status on our specific card (the checklist button is the first button inside the card)
    await taskCard.locator('button').first().click();

    // Verify toast notification and visual line-through style
    await expect(page.locator('text=Task updated successfully').first()).toBeVisible();
    await expect(page.getByText(uniqueTitle)).toHaveClass(/line-through/);

    // Toggle back to pending on our specific card
    await taskCard.locator('button').first().click();
    await expect(page.locator('text=Task updated successfully').first()).toBeVisible();
    await expect(page.getByText(uniqueTitle)).not.toHaveClass(/line-through/);

    // --- 3. EDIT DETAILS SCENARIO ---
    // Click edit button on our specific task card
    await taskCard.locator('button[title="Edit Task"]').click();

    // Verify modal transitions to edit mode
    await expect(page.getByRole('heading', { name: 'Edit Task' })).toBeVisible();

    // Edit title
    const updatedTitle = `${uniqueTitle} - Updated`;
    await page.locator('input#title').fill(updatedTitle);

    // Change priority to Low
    await page.locator('button#priority').click();
    await page.getByRole('option', { name: 'Low' }).click();

    // Save edited task
    await page.getByRole('button', { name: 'Save' }).click();

    // Assert success toast and updated details in UI
    await expect(page.locator('text=Task updated successfully').first()).toBeVisible();
    
    // Update our scoped taskCard reference to the new title using ancestor traversal
    const updatedTaskCard = page.getByText(updatedTitle).locator('xpath=./ancestor::div[contains(@class, "rounded-[1.5rem]")]');
    await expect(updatedTaskCard).toBeVisible();
    await expect(updatedTaskCard.locator('text=Low 🌸')).toBeVisible();

    // --- 4. SEARCH AND FILTER SCENARIO ---
    // Type in search bar
    await page.locator('input[placeholder="Search for a task..."]').fill(updatedTitle);
    
    // Assert task is filtered and visible
    await expect(page.locator(`text=${updatedTitle}`)).toBeVisible();

    // Type query that matches nothing
    await page.locator('input[placeholder="Search for a task..."]').fill('MatchingNothingSearchQuery');
    
    // Assert empty state is shown
    await expect(page.locator('text=You\'re all caught up!')).toBeVisible();

    // Clear search
    await page.locator('input[placeholder="Search for a task..."]').fill('');

    // --- 5. SOFT DELETE SCENARIO ---
    // Click delete button
    await page.locator(`button[title="Delete Task"]`).first().click();

    // Verify delete confirm modal
    await expect(page.getByRole('heading', { name: 'Delete Task' })).toBeVisible();

    // Click confirm Delete
    await page.getByRole('button', { name: 'Delete', exact: true }).click();

    // Assert success toast and task disappears
    await expect(page.locator('text=Task deleted successfully').first()).toBeVisible();
    await expect(page.locator(`text=${updatedTitle}`)).not.toBeVisible();
  });
});
