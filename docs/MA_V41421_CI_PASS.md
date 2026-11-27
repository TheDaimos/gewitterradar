# MA V4.14.21 strict regression PASS

Workflow: Build V4.14.21 MA opt-in and migration DEV mirrors
Run ID: 46048762763
Tested SHA: b4ffa2b0fc8d9655ec27d1af905c01681d92e334
Branch: feature/v4.14-monitored-areas

Every MA-020, MA-021 and MA-022 command in the regression shell returned exit code 0; set -e -o pipefail prevents hidden failures.
The canonical build and distribution mirrors are committed separately in this job.
