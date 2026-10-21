# Signastry pre-launch checklist

Items to finish before the live site opens. Test-mode-only features switch off together (`TEST_PHASE`).

## Accounts and sign-in
- Real accounts on a secure live system (Supabase Auth), replacing 4-digit PINs.
- Strong passwords (length and breach checks), with "Forgot password" by email.
- Two-step verification (authenticator app or text code) for every member and signer; required for staff.
- Individual staff logins with two-step verification, replacing the shared staff PIN.
- Sign-in by typing your name (already built; turns on when test mode is off).
- Lock accounts after repeated wrong attempts.

## Data and privacy
- Separate live database with locked-down access rules (the test database is open by design).
- Seal numbers, contact details and payout accounts readable only by the server.
- Move tester emails and points from the private tester list into real accounts.

## Identity and money
- Real ID verification for signers (Stripe Identity or Persona).
- Real payments and signer payouts.

## Legal
- Attorney review: signer agreement, estate and beneficiary clauses, referral and partner terms, testimonial and endorsement rules, income claims in outreach letters.

## Site
- Enforce HTTPS in GitHub Pages.
- Switch outreach letter links from test.signastry.com to the live address.
- Turn test mode off (removes TEST stamps, tester invite, demo hints).
