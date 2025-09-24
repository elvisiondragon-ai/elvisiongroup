| info                 | column_name                 | data_type                | is_nullable | column_default          |
| -------------------- | --------------------------- | ------------------------ | ----------- | ----------------------- |
| AUTH.USERS STRUCTURE | instance_id                 | uuid                     | YES         | null                    |
| AUTH.USERS STRUCTURE | id                          | uuid                     | NO          | null                    |
| AUTH.USERS STRUCTURE | aud                         | character varying        | YES         | null                    |
| AUTH.USERS STRUCTURE | role                        | character varying        | YES         | null                    |
| AUTH.USERS STRUCTURE | email                       | character varying        | YES         | null                    |
| AUTH.USERS STRUCTURE | encrypted_password          | character varying        | YES         | null                    |
| AUTH.USERS STRUCTURE | email_confirmed_at          | timestamp with time zone | YES         | null                    |
| AUTH.USERS STRUCTURE | invited_at                  | timestamp with time zone | YES         | null                    |
| AUTH.USERS STRUCTURE | confirmation_token          | character varying        | YES         | null                    |
| AUTH.USERS STRUCTURE | confirmation_sent_at        | timestamp with time zone | YES         | null                    |
| AUTH.USERS STRUCTURE | recovery_token              | character varying        | YES         | null                    |
| AUTH.USERS STRUCTURE | recovery_sent_at            | timestamp with time zone | YES         | null                    |
| AUTH.USERS STRUCTURE | email_change_token_new      | character varying        | YES         | null                    |
| AUTH.USERS STRUCTURE | email_change                | character varying        | YES         | null                    |
| AUTH.USERS STRUCTURE | email_change_sent_at        | timestamp with time zone | YES         | null                    |
| AUTH.USERS STRUCTURE | last_sign_in_at             | timestamp with time zone | YES         | null                    |
| AUTH.USERS STRUCTURE | raw_app_meta_data           | jsonb                    | YES         | null                    |
| AUTH.USERS STRUCTURE | raw_user_meta_data          | jsonb                    | YES         | null                    |
| AUTH.USERS STRUCTURE | is_super_admin              | boolean                  | YES         | null                    |
| AUTH.USERS STRUCTURE | created_at                  | timestamp with time zone | YES         | null                    |
| AUTH.USERS STRUCTURE | updated_at                  | timestamp with time zone | YES         | null                    |
| AUTH.USERS STRUCTURE | phone                       | text                     | YES         | NULL::character varying |
| AUTH.USERS STRUCTURE | phone_confirmed_at          | timestamp with time zone | YES         | null                    |
| AUTH.USERS STRUCTURE | phone_change                | text                     | YES         | ''::character varying   |
| AUTH.USERS STRUCTURE | phone_change_token          | character varying        | YES         | ''::character varying   |
| AUTH.USERS STRUCTURE | phone_change_sent_at        | timestamp with time zone | YES         | null                    |
| AUTH.USERS STRUCTURE | confirmed_at                | timestamp with time zone | YES         | null                    |
| AUTH.USERS STRUCTURE | email_change_token_current  | character varying        | YES         | ''::character varying   |
| AUTH.USERS STRUCTURE | email_change_confirm_status | smallint                 | YES         | 0                       |
| AUTH.USERS STRUCTURE | banned_until                | timestamp with time zone | YES         | null                    |
| AUTH.USERS STRUCTURE | reauthentication_token      | character varying        | YES         | ''::character varying   |
| AUTH.USERS STRUCTURE | reauthentication_sent_at    | timestamp with time zone | YES         | null                    |
| AUTH.USERS STRUCTURE | is_sso_user                 | boolean                  | NO          | false                   |
| AUTH.USERS STRUCTURE | deleted_at                  | timestamp with time zone | YES         | null                    |
| AUTH.USERS STRUCTURE | is_anonymous                | boolean                  | NO          | false                   |


| info                   | id                                   | email                   | email_confirmed_at            | phone | created_at                    | updated_at                    | raw_user_meta_data                                                                                                                                             | raw_app_meta_data                          |
| ---------------------- | ------------------------------------ | ----------------------- | ----------------------------- | ----- | ----------------------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| AUTH.USERS SAMPLE DATA | 38625adb-dcfb-4bac-b473-2e6ee37af72e | mochseno91@gmail.com    | 2025-08-09 11:07:55.875052+00 | null  | 2025-08-09 11:07:55.805633+00 | 2025-09-07 16:40:20.829511+00 | {"sub":"38625adb-dcfb-4bac-b473-2e6ee37af72e","email":"mochseno91@gmail.com","email_verified":true,"phone_verified":false}                                     | {"provider":"email","providers":["email"]} |
| AUTH.USERS SAMPLE DATA | 71a968fa-20e2-40a3-b260-004d43cca420 | deliais@yahoo.com       | 2025-08-09 11:52:17.726399+00 | null  | 2025-08-09 11:52:17.703157+00 | 2025-08-22 00:25:52.715495+00 | {"sub":"71a968fa-20e2-40a3-b260-004d43cca420","email":"deliais@yahoo.com","email_verified":true,"phone_verified":false}                                        | {"provider":"email","providers":["email"]} |
| AUTH.USERS SAMPLE DATA | 93819275-d50f-40d7-b404-6e1043b33265 | thomasakbar66@gmail.com | 2025-09-19 07:41:49.887188+00 | null  | 2025-09-19 07:41:49.872877+00 | 2025-09-19 07:41:49.902273+00 | {"sub":"93819275-d50f-40d7-b404-6e1043b33265","email":"thomasakbar66@gmail.com","display_name":"Thomas Al Akbar","email_verified":true,"phone_verified":false} | {"provider":"email","providers":["email"]} |


| info                    | column_name  | data_type                   | is_nullable | column_default |
| ----------------------- | ------------ | --------------------------- | ----------- | -------------- |
| AUTH.SESSIONS STRUCTURE | id           | uuid                        | NO          | null           |
| AUTH.SESSIONS STRUCTURE | user_id      | uuid                        | NO          | null           |
| AUTH.SESSIONS STRUCTURE | created_at   | timestamp with time zone    | YES         | null           |
| AUTH.SESSIONS STRUCTURE | updated_at   | timestamp with time zone    | YES         | null           |
| AUTH.SESSIONS STRUCTURE | factor_id    | uuid                        | YES         | null           |
| AUTH.SESSIONS STRUCTURE | aal          | USER-DEFINED                | YES         | null           |
| AUTH.SESSIONS STRUCTURE | not_after    | timestamp with time zone    | YES         | null           |
| AUTH.SESSIONS STRUCTURE | refreshed_at | timestamp without time zone | YES         | null           |
| AUTH.SESSIONS STRUCTURE | user_agent   | text                        | YES         | null           |
| AUTH.SESSIONS STRUCTURE | ip           | inet                        | YES         | null           |
| AUTH.SESSIONS STRUCTURE | tag          | text                        | YES         | null           |


| info                      | id                                   | user_id                              | created_at                    | updated_at                    | factor_id | aal  | not_after | refreshed_at               | user_agent                                                                                                                                | ip              |
| ------------------------- | ------------------------------------ | ------------------------------------ | ----------------------------- | ----------------------------- | --------- | ---- | --------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| AUTH.SESSIONS SAMPLE DATA | e7ccd1cc-b06e-4b65-9c03-48b8e47ce453 | ed289706-acf5-4af5-9301-2bfb0128f0f5 | 2025-09-24 01:08:00.518611+00 | 2025-09-24 01:08:00.518611+00 | null      | aal1 | null      | null                       | Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36                     | 180.243.11.15   |
| AUTH.SESSIONS SAMPLE DATA | 8893bc7e-1f35-449f-844f-32bf59894f50 | c644f60a-2f41-41fa-8814-b698c5154474 | 2025-09-23 23:40:46.597177+00 | 2025-09-24 00:53:21.905259+00 | null      | aal1 | null      | 2025-09-24 00:53:21.905182 | Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36                           | 180.243.11.15   |
| AUTH.SESSIONS SAMPLE DATA | 2aaf5a33-20e4-4fdc-b29c-16c124bb589b | ed289706-acf5-4af5-9301-2bfb0128f0f5 | 2025-09-23 16:55:41.105321+00 | 2025-09-24 00:45:53.931222+00 | null      | aal1 | null      | 2025-09-24 00:45:53.931149 | Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36                     | 180.243.11.15   |
| AUTH.SESSIONS SAMPLE DATA | f9e67bce-7b2d-4284-8c39-c1a3d5a4fd85 | 271a608c-0b55-4e42-9d13-293ad20e914e | 2025-09-09 00:07:08.400781+00 | 2025-09-24 00:12:40.469398+00 | null      | aal1 | null      | 2025-09-24 00:12:40.469329 | Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36                           | 103.155.192.196 |
| AUTH.SESSIONS SAMPLE DATA | a12eba46-3a84-4b0f-83a0-77d7e290bc39 | 74a895f6-e11e-47a6-b4d3-a89092905776 | 2025-09-23 23:00:23.093504+00 | 2025-09-23 23:58:53.252966+00 | null      | aal1 | null      | 2025-09-23 23:58:53.252892 | Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1 | 103.154.138.30  |

| info                          | column_name | data_type                | is_nullable |
| ----------------------------- | ----------- | ------------------------ | ----------- |
| AUTH.REFRESH_TOKENS STRUCTURE | instance_id | uuid                     | YES         |
| AUTH.REFRESH_TOKENS STRUCTURE | id          | bigint                   | NO          |
| AUTH.REFRESH_TOKENS STRUCTURE | token       | character varying        | YES         |
| AUTH.REFRESH_TOKENS STRUCTURE | user_id     | character varying        | YES         |
| AUTH.REFRESH_TOKENS STRUCTURE | revoked     | boolean                  | YES         |
| AUTH.REFRESH_TOKENS STRUCTURE | created_at  | timestamp with time zone | YES         |
| AUTH.REFRESH_TOKENS STRUCTURE | updated_at  | timestamp with time zone | YES         |
| AUTH.REFRESH_TOKENS STRUCTURE | parent      | character varying        | YES         |
| AUTH.REFRESH_TOKENS STRUCTURE | session_id  | uuid                     | YES         |

| relationship                      | auth_user_id                         | auth_email                   | session_id                           | session_created               | session_refreshed          | profile_user_id                      | display_name               | level | experience_points |
| --------------------------------- | ------------------------------------ | ---------------------------- | ------------------------------------ | ----------------------------- | -------------------------- | ------------------------------------ | -------------------------- | ----- | ----------------- |
| USER-SESSION-PROFILE RELATIONSHIP | ed289706-acf5-4af5-9301-2bfb0128f0f5 | deliais2001@gmail.com        | e7ccd1cc-b06e-4b65-9c03-48b8e47ce453 | 2025-09-24 01:08:00.518611+00 | null                       | ed289706-acf5-4af5-9301-2bfb0128f0f5 | Setiadi                    | 4     | 1450              |
| USER-SESSION-PROFILE RELATIONSHIP | c644f60a-2f41-41fa-8814-b698c5154474 | srcindocs@gmail.com          | 8893bc7e-1f35-449f-844f-32bf59894f50 | 2025-09-23 23:40:46.597177+00 | 2025-09-24 00:53:21.905182 | c644f60a-2f41-41fa-8814-b698c5154474 | aisah                      | 3     | 496               |
| USER-SESSION-PROFILE RELATIONSHIP | ed289706-acf5-4af5-9301-2bfb0128f0f5 | deliais2001@gmail.com        | 2aaf5a33-20e4-4fdc-b29c-16c124bb589b | 2025-09-23 16:55:41.105321+00 | 2025-09-24 00:45:53.931149 | ed289706-acf5-4af5-9301-2bfb0128f0f5 | Setiadi                    | 4     | 1450              |
| USER-SESSION-PROFILE RELATIONSHIP | 271a608c-0b55-4e42-9d13-293ad20e914e | armadijambi98@gmail.com      | f9e67bce-7b2d-4284-8c39-c1a3d5a4fd85 | 2025-09-09 00:07:08.400781+00 | 2025-09-24 00:12:40.469329 | 271a608c-0b55-4e42-9d13-293ad20e914e | armadi Hokky               | 3     | 350               |
| USER-SESSION-PROFILE RELATIONSHIP | 74a895f6-e11e-47a6-b4d3-a89092905776 | evira.rotorasiko37@gmail.com | a12eba46-3a84-4b0f-83a0-77d7e290bc39 | 2025-09-23 23:00:23.093504+00 | 2025-09-23 23:58:53.252892 | 74a895f6-e11e-47a6-b4d3-a89092905776 | Evira Rotorasiko           | 3     | 1163              |
| USER-SESSION-PROFILE RELATIONSHIP | 23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a | nandangstn69@gmail.com       | 90744a43-2984-458d-8396-e6123c814727 | 2025-09-23 04:31:59.489612+00 | 2025-09-23 23:55:20.491053 | 23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a | NANDANG SETIAWAN,S.H.,M.H. | 1     | 102               |
| USER-SESSION-PROFILE RELATIONSHIP | a5324ccb-3584-43d3-9706-9ab2155f2bbf | mahharazza@gmail.com         | f9e5bf7b-d2ce-4ba8-a847-c3c980bbdbc6 | 2025-08-12 13:56:08.23473+00  | 2025-09-23 21:56:45.272998 | a5324ccb-3584-43d3-9706-9ab2155f2bbf | mahharazza                 | 1     | 120               |
| USER-SESSION-PROFILE RELATIONSHIP | a8a834c2-7761-4e6e-95b1-2a3a81190fd4 | sasandomlg43@gmail.com       | 672f804f-904f-45b7-9d59-68698510f6dd | 2025-09-23 17:45:41.389498+00 | null                       | a8a834c2-7761-4e6e-95b1-2a3a81190fd4 | sasandomlg43               | 1     | 2                 |
| USER-SESSION-PROFILE RELATIONSHIP | 2a8a6482-3898-4ce6-a9b2-48285eb5b703 | riyadfahrudin340@gmail.com   | 6fa27207-0fe5-45ce-921c-f348b9ddfea3 | 2025-09-23 17:32:29.581288+00 | null                       | 2a8a6482-3898-4ce6-a9b2-48285eb5b703 | riyadfahrudin340           | 1     | 0                 |
| USER-SESSION-PROFILE RELATIONSHIP | 5f250128-655b-41a4-af15-9df32a5ca672 | okipambudi@gmail.com         | e43238e8-d12c-40e9-ab27-01f57969b5b2 | 2025-09-17 14:02:06.314631+00 | 2025-09-23 17:10:10.402254 | 5f250128-655b-41a4-af15-9df32a5ca672 | okipambudi                 | 1     | 50                |

| explanation                         | function_info                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SUPABASE FUNCTION CALLS EXPLANATION | supabase.auth.getUser() - Gets user from JWT token (fast, client-side)
     supabase.auth.getSession() - Gets full session + user (slower, includes tokens)
     supabase.from("profiles") - Database query to profiles table (slowest)
     
     SESSION CONTAINS:
     - access_token (JWT)
     - refresh_token
     - expires_at
     - expires_in
     - token_type
     - user object (id, email, metadata)
     
     USER OBJECT CONTAINS:
     - id (UUID)
     - email
     - phone
     - created_at
     - updated_at
     - email_confirmed_at
     - raw_user_meta_data (custom fields)
     - raw_app_meta_data (system fields)
     
     SPEED RANKING (fastest to slowest):
     1. getUser() - just user data from token
     2. getSession() - full session + user data  
     3. database queries - actual database calls |

     | info            | table_name        | table_type |
| --------------- | ----------------- | ---------- |
| ALL AUTH TABLES | audit_log_entries | BASE TABLE |
| ALL AUTH TABLES | flow_state        | BASE TABLE |
| ALL AUTH TABLES | identities        | BASE TABLE |
| ALL AUTH TABLES | instances         | BASE TABLE |
| ALL AUTH TABLES | mfa_amr_claims    | BASE TABLE |
| ALL AUTH TABLES | mfa_challenges    | BASE TABLE |
| ALL AUTH TABLES | mfa_factors       | BASE TABLE |
| ALL AUTH TABLES | oauth_clients     | BASE TABLE |
| ALL AUTH TABLES | one_time_tokens   | BASE TABLE |
| ALL AUTH TABLES | refresh_tokens    | BASE TABLE |
| ALL AUTH TABLES | saml_providers    | BASE TABLE |
| ALL AUTH TABLES | saml_relay_states | BASE TABLE |
| ALL AUTH TABLES | schema_migrations | BASE TABLE |
| ALL AUTH TABLES | sessions          | BASE TABLE |
| ALL AUTH TABLES | sso_domains       | BASE TABLE |
| ALL AUTH TABLES | sso_providers     | BASE TABLE |
| ALL AUTH TABLES | users             | BASE TABLE |