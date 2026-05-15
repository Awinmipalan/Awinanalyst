# Security Specification

## 1. Data Invariants
- Users can only read/write their own profiles.
- usage.dailyCount resets daily.
- Admins can read all, write all.
- Users cannot modify their 'role' to 'admin'.

## 2. The "Dirty Dozen" Payloads
1. User A tries to edit User B's profile.
2. User A tries to create a custom 'admin' role in their own profile.
3. User A tries to write to `/admins/userA`.
4. User A tries to read `/admins`.
5. User A tries to set `dailyCount` to 999.
6. User A tries to set a future date in `lastAccessDate`.
7. User A tries to read `/users/userB/usage/daily`.
8. User A tries to create a new collection `/unprotected`.
9. Admin tries to read `/users/userB/usage/daily` (Allowed).
10. Anonymous user tries to read.
11. Unverified user tries to write/read.
12. User tries to inject long string into `lastAccessDate`.

## 3. Test Runner (Conceptual)
Verify that all payloads from payload set fail for unprivileged users.
