# MA V4.14.26 strict regression PASS

Workflow: Build V4.14.26 MA opt-in and migration DEV mirrors
Run ID: 46166324330
Tested SHA: b8af0cd12c27c228561658b41059812e82e3fc8e
Branch: feature/v4.14-monitored-areas

Every MA-020, MA-021 and MA-022 command in the regression shell returned exit code 0; set -e -o pipefail prevents hidden failures.
The canonical build and distribution mirrors are committed separately in this job.
