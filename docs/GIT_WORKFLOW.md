# Git Workflow

## Branching

- Use short-lived branches for focused work.
- Name branches by intent, for example `feature/home-dashboard` or `docs/standards-update`.
- Keep one change theme per branch when possible.

## Commit Style

- Write concise, imperative commit messages.
- Prefer messages that describe the outcome, for example `docs: add architecture standards`.
- Avoid mixing unrelated changes in one commit.

## Pull Requests

- Keep pull requests small enough to review quickly.
- Include a short summary of the change and the reason for it.
- Call out any architecture or workflow impact explicitly.
- Do not merge documentation-only changes with feature work unless necessary.

## Review Expectations

- Verify that route files stay minimal.
- Verify that shared code stays in `src/`.
- Verify that naming and import rules are followed.
- Verify that no business logic is introduced into documentation-only or routing layers.

## Merge Hygiene

- Prefer clean, incremental history.
- Resolve formatting issues before review.
- Rebase or update branches as needed to keep the main branch current.
