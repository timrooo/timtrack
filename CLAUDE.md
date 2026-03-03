# CLAUDE.md

This file provides guidance for AI assistants (e.g., Claude Code) working in this repository.

## Project Overview

**timtrack** is a time tracking application. As of the initial commit, the project is in its earliest stage — no source code, framework, or dependencies have been added yet.

**Repository:** https://github.com/timrooo/timtrack
**Current state:** Bare repository with only a README.

---

## Repository Structure

```
timtrack/
└── README.md       # Project title only
```

As the project grows, this file should be updated to reflect the actual structure.

---

## Git Workflow

### Branches

- `master` — primary branch; treat as the stable baseline
- `claude/<session-id>` — branches created by Claude Code for AI-driven sessions

### Commit conventions

- Write short, imperative subject lines (≤ 72 chars): `Add login endpoint`, `Fix timer reset bug`
- Use the body to explain *why*, not *what*
- Do not commit secrets, credentials, or `.env` files

### Push rules

- Always push with tracking: `git push -u origin <branch-name>`
- Branch names for Claude Code sessions must start with `claude/`
- Never force-push to `master` without explicit user approval

---

## Development Setup

> This section will be filled in once the technology stack is chosen.

Likely steps will include:

1. Clone the repository
2. Install dependencies (e.g., `npm install` or `pip install -r requirements.txt`)
3. Copy `.env.example` → `.env` and configure environment variables
4. Run the development server

---

## Testing

> No test framework has been configured yet.

When tests are added, document here:
- How to run the full test suite
- How to run a single test file
- Coverage requirements or CI gates

---

## Code Conventions

Since no code exists yet, these are the conventions that **should** be followed when the project is built:

- Keep functions small and single-purpose
- Prefer explicit over implicit
- Validate user input at system boundaries (API endpoints, form submissions)
- Avoid hard-coded values — use environment variables or config files
- Do not add unnecessary abstractions; solve the problem at hand

---

## AI Assistant Guidelines

### What to do

- Read existing files before proposing or making changes
- Make the minimal change needed to satisfy the task
- Ask for clarification when the task is ambiguous rather than guessing
- Update this CLAUDE.md when significant structural changes are made to the project

### What to avoid

- Do not create files that are not necessary for the current task
- Do not refactor code that is outside the scope of the current task
- Do not add extra error handling, logging, or validation beyond what is clearly needed
- Do not add comments or docstrings to code you did not write or change
- Do not push to `master` or any branch other than the designated session branch without explicit approval

### Security

- Never commit secrets, API keys, tokens, or passwords
- Do not introduce SQL injection, XSS, command injection, or other OWASP Top 10 vulnerabilities
- If you discover a vulnerability while working, flag it to the user immediately

---

## Updating This File

When the project evolves, update this file to reflect:

1. The actual technology stack and version requirements
2. Accurate directory structure
3. Real setup and run instructions
4. Testing commands and coverage expectations
5. Any project-specific coding conventions or patterns discovered in the codebase
