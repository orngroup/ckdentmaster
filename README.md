# CK Dentmaster – Job Manager

A mobile job-management app for CK Dentmaster (paintless dent repair). It is an installable web app (PWA) hosted on GitHub Pages and backed by Firebase (Authentication + Cloud Firestore, free Spark plan). No app store needed – open the link on your phone and add it to the home screen.

**What it does**

- Jobs list (Open / Today / This week / Unpaid / All) with search by reg, name, car or postcode
- 4-step job form: Customer → Vehicle (reg, manufacturer → model → colour, year) → Work (panels + description) → Booking & cost
- Calendar view by month with a day list; add a job straight onto a date
- Job detail with **Start / Finish timer** (time per job), before/after **photos**, call / text / navigate buttons, mark as paid
- **PDF report** built on the phone (logo, customer, vehicle, work, before/after photos, time, cost) – shares straight to WhatsApp, Mail, etc.
- **Job link** – a public web page for the customer (`report.html?r=…`) with photos and cost, shareable by WhatsApp; the customer can save it as a PDF
- **Job types** – Auto Capital or Private, with filters on the jobs list and reports
- **Price templates** – tap Price 1–4 (£100/£150/£200/£250 by default) to fill the price, still editable per job; edit the templates under Settings (gear icon)
- **Reports tab** – this week / month / last month / year / custom range, by job type; totals plus a landscape PDF report and CSV export, both shareable
- **Invoicing** – "Finish & invoice" on the job stops the timer, pre-fills an invoice (Auto Capital details or the private customer), and on save creates a numbered invoice PDF in the CK Dentmaster layout plus the job report, shared together. Invoices tab shows issued / paid / outstanding with mark-paid, edit and re-share.
- Business details, bank details, invoice numbering and the Auto Capital bill-to defaults are under Settings
- Customers list with job history and paid total
- "Use my current location" on the job form pins GPS to the job (asks for location permission); photos ask for camera permission the first time
- Stats: jobs, charged, paid, outstanding, average time and £ per job, breakdown by manufacturer
- Works offline (Firestore cache) and syncs when back online

Sign-in is a single user – **Jay Khatri** – with a PIN.

---

## Setup

### 1. Firebase – the app user

1. Firebase Console → project **ck-dentmaster** → **Build → Authentication → Get started**.
2. Sign-in method → enable **Email/Password** → Save.
3. **Users** tab → **Add user**:
   - Email: `jay@ckdentmaster.app`
   - Password: `ckdm-0000`
4. In the app, Jay signs in with PIN **0000**. (The app adds the `ckdm-` prefix because Firebase needs 6+ characters.)
   To change the PIN later, change that user's password in Firebase to `ckdm-<new PIN>`.

> Note: the repo is public, so the PIN scheme is visible in `index.html`. Firebase locks the account after repeated wrong attempts, but if you want it fully private, make the GitHub repo private (GitHub Pages from a private repo needs a GitHub Pro plan) or use a longer PIN.

### 2. Firebase – Firestore rules

**Build → Firestore Database → Rules** → replace everything with the contents of `firestore.rules` → **Publish**.

### 3. Firebase – web config and domain

1. Project settings (gear) → **Your apps** → if no web app yet, click **`</>`**, name it "CK Dentmaster", **Register app**.
2. Under *SDK setup and configuration* choose **Config** and copy the `firebaseConfig` object into `firebase-config.js`, replacing the placeholders.
3. **Authentication → Settings → Authorized domains → Add domain** → `orngroup.github.io`.

### 4. GitHub Pages

Upload all files in this folder to the `main` branch of `orngroup/ckdentmaster` (keep the `icons/` folder). Pages is set to main / (root), so the app is live at

**https://orngroup.github.io/ckdentmaster/**

### 5. Add to home screen (instructions also shown on the sign-in screen)

- **iPhone:** open the link in **Safari** → tap **Share** (box with an arrow) → **Add to Home Screen** → Add.
- **Android:** open the link in **Chrome** → tap **⋮** → **Add to Home screen** / **Install app**.

The CK icon appears on the home screen and the app opens full-screen.

---

## Day-to-day

- First run: **Settings (gear) → Load sample job** adds Ajay Kawa / Range Rover Evoque, 24 Oct 2026 11:00, with before/after photos so you can see everything working. Delete it from the job screen when done.

- **+** → add a job. Pick an existing customer or type a new one (customers are created automatically and matched by phone number).
- Manufacturer / model lists cover the common UK makes. Choose **Other / add new…** to type one – it's remembered.
- **Start job** when you begin, **Finish job** when done – the duration is saved and used for the average-time stat and the report.
- **Add photo** under *Before* and *After* opens the camera or library. Photos are shrunk to ~1280 px so they stay small (roughly 100–200 KB each).
- **Create PDF report** → the share sheet opens → choose WhatsApp (or Mail, Files…).
- **Create job link** → makes a public page for this job and opens the share sheet. Press it again after adding photos to update the page. **Remove link** takes the page down.
- **Mark as paid** sets the status to Paid and records the date.

## Updating the app

Edit `index.html`, bump `CACHE = "ckdm-v7"` in `sw.js`, push to `main`. Phones pick up the new version next time the app opens online.

## Data model (Firestore)

| Collection | Notes |
|---|---|
| `customers/{id}` | name, phone, email, address, postcode, notes |
| `jobs/{id}` | customer snapshot, reg, make, model, colour, year, panels[], description, notes, bookedDate, bookedTime, status, startedAt, finishedAt, durationMins, quote, cost, paid, paidAt, payMethod, shareToken |
| `jobs/{id}/photos/{id}` | type (before/after), data (JPEG data URL) |
| `public_reports/{token}` | read-only copy of a job for the customer link |
| `settings/vehicles` | makes/models you have added |
| `settings/pricing` | price templates (items: name, amount) |
| `settings/business` | trading name, address, phone, email, bank details, invoice prefix + next number, Auto Capital bill-to |
| `invoices/{id}` | number, jobId, billTo{}, lines[], total, date, due, paid, paidDate, payMethod |

Photos are kept in Firestore so the project stays on the free Spark plan (no Storage bucket or card needed).
