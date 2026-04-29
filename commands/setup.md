# Command: setup

## Purpose

Prepare the local development environment for the Mobile Quality Engineering Pipeline.

## Preconditions

- Node.js, Java, Android SDK, and Xcode installed per README prerequisites
- Access to required accounts (BrowserStack, MobSF, Percy, etc.)

## Steps

1. Clone the repository
2. Run `npm install` to install dependencies
3. Install Newman globally (`npm install -g newman`)
4. Copy `.env.example` to `.env` and fill in all required secrets
5. Verify all required tools are on PATH

## Expected Output

- All dependencies installed
- Environment variables configured
- Ready to run tests and pipeline commands

## Failure Handling

- If a tool is missing, output a clear error and link to installation instructions
- If secrets are missing, block further steps and prompt for completion
- TODO: Automate tool verification and onboarding script
