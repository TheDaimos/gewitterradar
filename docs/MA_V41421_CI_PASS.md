# MA V4.14.21 strict regression PASS

Workflow: Build V4.14.21 MA opt-in and migration DEV mirrors
Run ID: 46075523896
Tested SHA: b42ba2f8788b29a930a28939700007e0e62004b1
Branch: feature/v4.14-monitored-areas

Every MA-020, MA-021 and MA-022 command in the regression shell returned exit code 0; set -e -o pipefail prevents hidden failures.
The canonical build and distribution mirrors are committed separately in this job.
