# MA V4.14.25 strict regression PASS

Workflow: Build V4.14.25 MA opt-in and migration DEV mirrors
Run ID: 46141517066
Tested SHA: ec51f8b27c8dfd3d5f828216ec2659854f4cc6bc
Branch: feature/v4.14-monitored-areas

Every MA-020, MA-021 and MA-022 command in the regression shell returned exit code 0; set -e -o pipefail prevents hidden failures.
The canonical build and distribution mirrors are committed separately in this job.
