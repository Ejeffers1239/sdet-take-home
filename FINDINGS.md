# Part 1 — Findings

Document each issue you found and fixed. Add or remove sections as needed
(there are three issues to find).

## Issue 1

- **Symptom:** (First Test "renders mocked portfolios from a stubbed API (component-style)" fails with element missing)
- **Root cause:** (Mock was not registered properly)
- **Fix location:** (In the test)
- **How I verified:** (re-ran npm test after using Cypress's "screenshots" feature to debug. The comment also laid out the issue exactly.)

## Issue 2

- **Symptom:** Page is rendering as blank/loading
- **Root cause:** callbacks and waits are not being handled properly to check the value after page reload
- **Fix location:** In the test
- **How I verified:** Used the "screenshots" feature to debug, and additionally opened a local copy of the service to verify the network logic/timings. Checked some examples to ensure I used correct Cypress syntax as well. Then of course ran the test to ensure it passes.

## Issue 3

- **Symptom:** Locator is not finding what it's looking for, a "positive value" field
- **Root cause:** Incorrect math on the app swapped cost basis and current price when calculating P&L
- **Fix location:** In the app
- **How I verified:** This was probably the simplest fix, fixed the formula and verified the test passes. I didn't need to do any specialized debugging here.

## Anything else you noticed

The application is doing a lot of math at runtime when rendering profiles (specifically in the profiles' serialize function). Having derived values like P&L calculated only at profile creation and saved as part of the profile object would make the page render slighly faster, as well as better seperate the model from the view. The drawback is that if these values are highly dynamic they may not always be up-to-date. It also requires slightly more memory usage. The ideal solution is some implementation of materialized views, but that's far more complicated than the scope of this exercise.

An implementation of contract creation on mocks woud make the integration more robust as well. This is also out of scope for the exercise.
