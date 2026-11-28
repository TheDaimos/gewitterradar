# MA V4.14.24 CI regression diagnostics

Branch: feature/v4.14-monitored-areas
Workflow: ma-v41424-dev-build-sync.yml
These are test results, not operator database data.

~~~
TAP version 13
# Subtest: default OFF / invalid flags: no runtime start, no owner writes or listeners
ok 1 - default OFF / invalid flags: no runtime start, no owner writes or listeners
  ---
  duration_ms: 22.274246
  type: 'test'
  ...
# Subtest: ON: one runtime start, idempotent teardown and restart
ok 2 - ON: one runtime start, idempotent teardown and restart
  ---
  duration_ms: 7.200263
  type: 'test'
  ...
# Subtest: disconnect and OFF terminate active runtime, no restart
ok 3 - disconnect and OFF terminate active runtime, no restart
  ---
  duration_ms: 0.98574
  type: 'test'
  ...
# Subtest: optional initialization and teardown failures remain isolated
ok 4 - optional initialization and teardown failures remain isolated
  ---
  duration_ms: 1.068505
  type: 'test'
  ...
# Subtest: regular optional registration and exact inventory/mirror hashes
ok 5 - regular optional registration and exact inventory/mirror hashes
  ---
  duration_ms: 11.72498
  type: 'test'
  ...
1..5
# tests 5
# suites 0
# pass 5
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 112.024576
PASS MA-023 model, mode gate, no implicit migration, UI integration and mirror
PASS MA-021 Havanna detail read-only geometry, drag and safety
PASS MA-021 Desktop/iPad portrait+landscape/mobile layout, session positioning and read-only profile guard
PASS MA-021 profile-scoped SQLite detail read gate, no pending access and no mutation receipt
PASS MA-021 existing GeoPoint launch, correct coordinates, explicit success, no tracker shift
PASS MA-022 role-scoped batch UI, migration gate, explicit share and own preferences
PASS MA-022 typed link/prefs commands, mode gate, explicit revisions, actor profile binding
PASS MA-023 bulk selection, sorting, db mode and safe stop
PASS P04 Tracker setup relocated to weather-engine and guarded
PASS MA-024 overview projection, filter, overlaps, privacy and read-only
PASS MA-024 manual SQLite create scoped consent and duplicate preview
PASS MA-024 overview/create wiring, timestamps and visible-only selection
test_denies_forged_target_and_own_preferences (__main__.Profiles.test_denies_forged_target_and_own_preferences) ... ok
test_receipt_replay_share_and_conflict (__main__.Profiles.test_receipt_replay_share_and_conflict) ... ok
test_share_and_transfer_isolated_profiles (__main__.Profiles.test_share_and_transfer_isolated_profiles) ... ok

----------------------------------------------------------------------
Ran 3 tests in 0.094s

OK
test_location_manager_is_discoverable_but_opt_in_writes_are_guarded (test_ma_frontend_module_registration.MonitoredAreasFrontendRegistrationTests.test_location_manager_is_discoverable_but_opt_in_writes_are_guarded) ... ok
test_manifest_versions_and_module_identity (test_ma_frontend_module_registration.MonitoredAreasFrontendRegistrationTests.test_manifest_versions_and_module_identity) ... ok
test_mirrored_frontend_artifacts_match (test_ma_frontend_module_registration.MonitoredAreasFrontendRegistrationTests.test_mirrored_frontend_artifacts_match) ... ok
test_optional_registration_does_not_activate_ha_runtime (test_ma_frontend_module_registration.MonitoredAreasFrontendRegistrationTests.test_optional_registration_does_not_activate_ha_runtime) ... ok

----------------------------------------------------------------------
Ran 4 tests in 0.005s

OK
test_feature_flag_rejects_non_boolean_truthy (test_ma_v4146_optin_contract.MAOptInContracts.test_feature_flag_rejects_non_boolean_truthy) ... ok
test_legacy_is_authority_until_server_verified_cutover (test_ma_v4146_optin_contract.MAOptInContracts.test_legacy_is_authority_until_server_verified_cutover) ... ok
test_native_integration_options_require_explicit_checkbox (test_ma_v4146_optin_contract.MAOptInContracts.test_native_integration_options_require_explicit_checkbox) ... ok
test_no_implicit_migration_or_direct_todo_delete_in_manager (test_ma_v4146_optin_contract.MAOptInContracts.test_no_implicit_migration_or_direct_todo_delete_in_manager) ... ok

----------------------------------------------------------------------
Ran 4 tests in 0.007s

OK
test_foreign_profile_cannot_read_preview (__main__.Tests.test_foreign_profile_cannot_read_preview) ... ok
test_no_source_fails_closed_not_empty_import (__main__.Tests.test_no_source_fails_closed_not_empty_import) ... ok
test_preview_is_read_only_and_flags_source_duplicates (__main__.Tests.test_preview_is_read_only_and_flags_source_duplicates) ... ok
test_source_or_db_changes_invalidate_fingerprint (__main__.Tests.test_source_or_db_changes_invalidate_fingerprint) ... ok

----------------------------------------------------------------------
Ran 4 tests in 0.070s

OK
test_admin_and_confirmation_required_without_deletion (__main__.FinalizationContracts.test_admin_and_confirmation_required_without_deletion) ... ok
test_archive_disallowed_before_cutover (__main__.FinalizationContracts.test_archive_disallowed_before_cutover) ... ok
test_archive_isolated_to_profile_link (__main__.FinalizationContracts.test_archive_isolated_to_profile_link) ... ok
test_archived_and_active_legacy_places_survive_verified_cutover (__main__.FinalizationContracts.test_archived_and_active_legacy_places_survive_verified_cutover) ... ok
test_archived_flag_mismatch_is_not_suggested_or_reused (__main__.FinalizationContracts.test_archived_flag_mismatch_is_not_suggested_or_reused) ... ok
test_complete_cutover_requires_verified_absence (__main__.FinalizationContracts.test_complete_cutover_requires_verified_absence) ... ok
test_concurrent_confirmation_cannot_repeat_deletion (__main__.FinalizationContracts.test_concurrent_confirmation_cannot_repeat_deletion) ... ok
test_duplicate_archived_places_never_get_unattended_suggestion (__main__.FinalizationContracts.test_duplicate_archived_places_never_get_unattended_suggestion) ... ok
test_ma022_profile_mutations_blocked_before_sqlite_cutover (__main__.FinalizationContracts.test_ma022_profile_mutations_blocked_before_sqlite_cutover) ... ok
test_metadata_change_after_approval_cannot_delete (__main__.FinalizationContracts.test_metadata_change_after_approval_cannot_delete) ... ok
test_mixed_status_source_drift_blocks_finalization (__main__.FinalizationContracts.test_mixed_status_source_drift_blocks_finalization) ... ok
test_no_import_no_deletion_and_no_db_active (__main__.FinalizationContracts.test_no_import_no_deletion_and_no_db_active) ... ok
test_partial_delete_recoverable_after_new_api_instance (__main__.FinalizationContracts.test_partial_delete_recoverable_after_new_api_instance) ... ok
test_preexisting_sqlite_places_offer_safe_reuse_without_writes (__main__.FinalizationContracts.test_preexisting_sqlite_places_offer_safe_reuse_without_writes) ... ok
test_removed_item_backup_tampering_blocks_resume (__main__.FinalizationContracts.test_removed_item_backup_tampering_blocks_resume) ... ok
test_removed_item_target_changed_after_restart_blocks_resume (__main__.FinalizationContracts.test_removed_item_target_changed_after_restart_blocks_resume) ... ok
test_resume_approval_invalidated_by_external_removal (__main__.FinalizationContracts.test_resume_approval_invalidated_by_external_removal) ... ok
test_reuse_cannot_alias_two_source_entries_to_same_sqlite_location (__main__.FinalizationContracts.test_reuse_cannot_alias_two_source_entries_to_same_sqlite_location) ... ok
test_skipped_item_and_changed_source_are_blocked (__main__.FinalizationContracts.test_skipped_item_and_changed_source_are_blocked) ... ok
test_source_uid_summary_collision_fail_closed (__main__.FinalizationContracts.test_source_uid_summary_collision_fail_closed) ... ok
test_sqlite_archive_restore_profile_scope_and_idempotency (__main__.FinalizationContracts.test_sqlite_archive_restore_profile_scope_and_idempotency) ... ok
test_stale_source_after_approval_cannot_delete (__main__.FinalizationContracts.test_stale_source_after_approval_cannot_delete) ... ok
test_tampering_with_archived_link_blocks_source_deletion (__main__.FinalizationContracts.test_tampering_with_archived_link_blocks_source_deletion) ... ok
test_three_archived_same_name_coordinates_preserve_distinct_uids (__main__.FinalizationContracts.test_three_archived_same_name_coordinates_preserve_distinct_uids) ... ok
test_unrelated_location_cannot_be_forged_as_existing_match (__main__.FinalizationContracts.test_unrelated_location_cannot_be_forged_as_existing_match) ... ok

----------------------------------------------------------------------
Ran 25 tests in 0.564s

OK
MA-020 optional startup reminder, location cutover and mirror contracts PASS
PASS MA-020 SQLite preview: archived grouping, invalid rows, read-only paging, safe DOM
node:internal/modules/run_main:123
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

6 !== 5

    at file:///home/runner/work/gewitterradar/gewitterradar/tests/test_ma_sqlite_preview.mjs:34:8 {
  generatedMessage: true,
  code: 'ERR_ASSERTION',
  actual: 6,
  expected: 5,
  operator: 'strictEqual',
  diff: 'simple'
}

Node.js v22.23.5
~~~
