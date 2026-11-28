# MA V4.14.27 strict regression PASS

Workflow: Build V4.14.27 MA opt-in and migration DEV mirrors
Run ID: 46178070509
Tested SHA: 85044a94a8ab543e43f40d01c6dacbbd620cd9e0
Branch: feature/v4.14-monitored-areas

Every MA-020, MA-021 and MA-022 command in the regression shell returned exit code 0; set -e -o pipefail prevents hidden failures.
The canonical build and distribution mirrors are committed separately in this job.
