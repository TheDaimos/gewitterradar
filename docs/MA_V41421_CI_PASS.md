# MA V4.14.21 strict regression PASS

Workflow: Build V4.14.21 MA opt-in and migration DEV mirrors
Run ID: 46048584704
Tested SHA: 63f9d86e9bccada32903dfdfe9157b864a46b3d1
Branch: feature/v4.14-monitored-areas

Every MA-020, MA-021 and MA-022 command in the regression shell returned exit code 0; set -e -o pipefail prevents hidden failures.
The canonical build and distribution mirrors are committed separately in this job.
