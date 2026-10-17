# Signastry

Pilot demo of Signastry, a registry for autographs, memorabilia and graded cards. Each item gets a registry ID, a QR seal, a photo record and a full ownership history, and signed items can be verified by the person who signed them.

## Try the demo

Live test site: https://test.signastry.com (the demo) and https://test.signastry.com/vault/ (the Vault).

Each page is a single self-contained HTML file with no build step: `index.html` is the demo and `vault/index.html` is the Vault.

Demo sign-ins (on the start page, tap **Sign in** and pick a role):

| Role | Account | PIN |
|---|---|---|
| Member | Demo member | 0000 |
| Member | R. Alvarez | 1234 |
| Signer | Dana Okafor / Marcus Hale / Lena Ortiz | 1111 / 2222 / 3333 |
| Admin | — | 9999 |

## What the demo covers

- **Members:** vault, item and graded-card registration, ownership transfers, member market, item look-up, invitations and Signastry Bucks rewards.
- **Signers:** verify items they signed, track earnings, withdraw, and sign legal forms.
- **Admin:** revenue overview, fee settings, removal requests, marketplace and invitation tracking.

## Notes

- Demo only: no payments are processed.
- Test data is shared: both pages save to a Supabase test database, so every visitor sees the same items, members and activity, with live updates. The demo and the Vault are kept separate. If the database can't be reached, a page falls back to saving in the viewer's own browser.
- The test database is open to anyone using the site (sample data only). Before launch, switch to real member accounts with per-member access rules and a separate live database.
- Database setup: run `supabase/setup.sql` once in the Supabase SQL Editor. The sync code lives in `supabase/sync-snippet.js` and is inlined at the end of each page.
- The legal documents are templates and need review by an attorney before launch.
