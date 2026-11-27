# MA V4.14.21 strict regression PASS

Workflow: Build V4.14.21 MA opt-in and migration DEV mirrors
Run ID: 46078015497
Tested SHA: f100fd6636a6a67b89bb3fd3bf14139ed770523e
Branch: feature/v4.14-monitored-areas

Every MA-020, MA-021 and MA-022 command in the regression shell returned exit code 0; set -e -o pipefail prevents hidden failures.
The canonical build and distribution mirrors are committed separately in this job.
