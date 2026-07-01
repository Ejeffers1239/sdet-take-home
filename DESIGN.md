# Part 2b — CI & Alerting Design

No code required here — we want your reasoning.

## 1. Running this suite in GitHub Actions on every PR

Describe the workflow: what triggers it, the job/steps, how you start the API
before the tests, and how a test failure fails the build. A YAML sketch is
welcome but optional.

```yaml
name: test-pipeline
on:
  pull_request:
    branches:
      - main
jobs:
  npm-test:
    runs-on: ubuntu-latest
    steps:
    - run: npm test
```

Notes:
- typically, testing workflows only need ran on a pull to main. this could be configured for any though. The failure summary in the next step can be easily toggled using the status of the npm-test job as well; having a job that "needs" npm-test handle emitting to Slack.

## 2. Failure summary to Slack (or structured JSON for alerting)

On a failed run, what would you post, and how do you keep it signal (not noise)?

- **What goes in the message:** I would give pass and fail count, total runtime (and per-test if possible.) as well as any specific exceptions which may have thrown, but not the whole stack trace if seperable.
- **How it's triggered:** Only on failure in main, flaky can be a different message, and failures in dev should be handled before anything is merged.
- **Keeping it useful:** If this is an alert off of a pull request, I would have it ping anyone on the PR, or at the very least the owner of the triggering commit, which is possible with GitHub Actions env variables.

If this is an alert off of the live, main branch, I would have it alert the service owner so they can create tickets/fix as needed. Possibly also QA for escaped defect metrics.
