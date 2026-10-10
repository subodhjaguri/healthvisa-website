# Admin guide

For HealthiFam staff using the admin website at **https://healthifam.vercel.app/admin**.

## Signing in

Sign in with your staff email and password. You stay signed in for 12 hours. Accounts are
created by the technical team; ask them for a new login or to remove one. Every staff login
can do everything in the admin website, so keep logins personal.

## Finding your way

The menu on the left:

| Menu item | Use it to |
|---|---|
| **Dashboard** | See what needs attention: appointments to confirm, open requests, totals |
| **Products and Services** | Categories, Symptoms, Products & Services (doctors), Diagnostics, Labs, Tests |
| **People → Users** | Look up members, edit details, change membership expiry, revoke membership, delete accounts |
| **Doctor Appointments** | Confirm, complete, reject or cancel doctor bookings |
| **Lab Appointments** | The same for lab and health-package bookings |
| **EHR Reports** | View health records members have uploaded (read-only) |
| **Health News** | Write and publish news shown in the app |
| **User Requests** | Approve membership requests; handle medicine orders and other requests |
| **Referrals** | Create referral codes and share links |
| **App Versions** | Set which app builds are supported |

Most lists have a **search box** and an **Export** button (CSV of what the table shows).

## New activity alerts

While any admin page is open, the website checks for new doctor bookings, lab bookings and
requests every 20 seconds. When something new arrives:

- a sound plays and a browser notification appears (allow notifications when the browser
  asks, after your first click);
- one summary message appears at the top, for example "3 new items";
- the **bell** at the top right shows the new items. Click an item to open its list and
  clear it from the bell.

Keep the admin website open in a tab during working hours. Browsers check less often (about
once a minute) when the tab is in the background.

## Membership requests

Members request a membership (or a renewal) in the app. Nothing is paid in the app: you
collect payment offline.

1. Open **User Requests**. Membership requests show the plan, any referral code or renewal
   discount, and the amount to collect.
2. Collect the payment from the member.
3. Press **Allow Access**. The confirmation shows the member, the plan and **"Collect ₹X
   offline"**. Confirm, and the membership starts straight away. The member sees their card
   the next time the app refreshes.
4. If approval was interrupted (for example the connection dropped), the button shows
   **Resume Approval**. Press it to finish; it never creates a second membership.
5. To turn a request down, set it to **Rejected** and confirm.

Good to know:

- A member can only have one open membership request at a time.
- Membership requests cannot be marked "Completed" by hand; use **Allow Access**.
- A renewal made while the current membership is still active starts when the current one
  ends, so the member does not lose days.

### Changing or ending a membership

In **People → Users**:

- **Revoke membership** ends a member's active membership immediately.
- **Edit** a user to change their **membership expiry** date. Setting a future date also
  reactivates an expired membership.
- **Edit** also manages the member's **family members** (up to 6) and their membership
  number.

## Doctor and lab appointments

New bookings arrive as **Placed** (the member sees "Awaiting confirmation"). Change the
status from the menu in each row. Only the allowed next steps are offered:

| From | You can choose |
|---|---|
| Placed | Appointment Booked (confirm), Rejected, Cancelled |
| Appointment Booked | Completed, Cancelled |
| Completed, Rejected, Cancelled | Final; cannot be changed |

- **Appointment Booked** confirms the appointment. In the member's app the booking changes
  from "Awaiting confirmation" to confirmed, and it can then appear as their **next
  appointment** on the Home screen (only confirmed bookings are shown there). The system also
  tries to send the member a push notification. Delivery is not guaranteed, so call the
  member if the confirmation is time-sensitive.
- **Completed** is only offered from the appointment day onwards.
- **Cancelled** asks for a **reason**, which the member sees on the booking in their
  Appointments tab. A push notification is also attempted. Past appointments cannot be
  cancelled.
- **Completed** and **Rejected** ask you to confirm, because they are final.
- If another staff member changed the same booking a moment earlier, you get a message.
  Refresh the list and check before trying again.

**Lab appointments** also show the visit type (lab, centre or home), the date and preferred
time windows for home visits, the tests or package, and the amount. Bookings made by
uploading a prescription have a link to the prescription and no amount. Confirm the price
with the member.

## Medicine orders and other requests

When a member uploads a prescription to order medicines, a request with **Applied for:
order medicine** appears in **User Requests** with a button to open the prescription.

1. Open the prescription and contact the member about price and delivery.
2. Set the request to **Completed** when done, or **Rejected** if it cannot be fulfilled.

Medicine orders sent through WhatsApp do not appear here.

## Doctors, labs and the catalogue

| Page | What you manage | Notes |
|---|---|---|
| **Categories** | Doctor specialities and service categories (name, tags, discount, description, image, show/hide) | The display order in the app is set by the technical team |
| **Symptoms** | Symptom tiles and the categories they lead to | |
| **Products & Services** | Doctors and services: name, category, price and discount, photo, qualification, hospital and address, description | Turn on **Bookable** and enter **Time Slots** (for example "10am to 12pm") for doctors members can book. Members can only book listed slots, and slots that have ended today are hidden |
| **Diagnostics** | Test groups (for example "Blood Test"), which labs offer them, visit types, discount | |
| **Labs** | Lab name, addresses, image, description | **Availability** is information shown to members; it does not limit bookings |
| **Tests** | Individual tests: test group, lab, name, MRP and discount | |
| **Health News** | Articles with images, author and publish date | |

**Health packages** (the "Health check-ups" in the app) cannot be edited here. Ask the
technical team to change packages or their prices.

## Referral codes

In **Referrals**:

- **Create** a code for a shop or partner. Type your own code or leave it empty to generate
  one, and add the referrer's name. Optionally set start and end dates.
- A valid code gives **10% off a member's first membership**. You collect the discounted
  amount offline; User Requests shows it.
- Use the switch to turn a code off without deleting it.
- **Share** gives a Google Play link with the code built in, and a QR code to download and
  print. Members who install the app from that link get the code filled in.
- The **Users** column shows how many members joined with each code.

## App versions

**App Versions** controls which builds of the mobile app may be used:

- **Minimum build:** older builds are blocked with an "Update required" screen.
- **Latest build:** older builds see an optional update suggestion.
- **Message:** the text shown with the prompt.

Only raise these numbers **after** the new app version is available on Google Play,
otherwise members cannot use the app. Agree changes with the technical team.

## Users and account deletion

- **People → Users** shows each member's membership number, phone, referral source and
  membership.
- **Delete** permanently removes the member and everything linked to them: records and
  files, bookings, requests, family members and memberships. It cannot be undone; the
  warning lists what will be removed.
- Members can also delete their own account in the app, or request deletion by email
  through the `/delete-account` page.
