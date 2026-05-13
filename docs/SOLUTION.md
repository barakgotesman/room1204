# The Davos Affair — Solution Reference (INTERNAL — DO NOT SHIP)

## The Answer
**Murderer: Marcus Webb** (Personal Assistant to Richard Harmon)

---

## Motive
Marcus was running an insider trading scheme — selling NovaPharma stock days before every major bad-news announcement. Harmon discovered it and was about to expose him. Marcus had to act before Davos ended and Harmon returned to New York.

---

## Method
Marcus used his research clearance (level 4, granted by Harmon himself) to steal one unit of compound **RH-7749** from NovaPharma's R&D lab on January 14 — 3 days before the murder. RH-7749 is a delayed-acting experimental compound: onset is 60–90 minutes after ingestion. Marcus entered Harmon's room at **20:25**, while Harmon was still at the hotel bar, and dissolved the compound in Harmon's drink in the minibar. Harmon returned at 21:18, drank, and died at approximately 21:50.

---

## Why Each Suspect Gets Eliminated

### James Okafor ❌
- Entered room 1204 at 21:34 — AFTER Harmon returned at 21:18
- RH-7749 is delayed-acting — poison was already administered before Okafor arrived
- Left at 21:59, before Harmon died at 21:50... actually Okafor left at 21:59 AFTER estimated death window starts at 21:40 — but he had no access to RH-7749 (clearance level 2, legal only)
- Called his law office from Zurich at 22:31 — he was already on a train out of Davos
- Emails with Harmon were about an NDA breach — legitimate legal dispute, not murder motive

### David Chen ❌
- Was on a 47-minute board call from Geneva at 21:10 — during the exact murder window
- Different city, different country
- Bought NovaPharma stock before the murder and LOST money when Harmon died — murder hurts Chen financially
- The acquisition deal was initiated by Harmon — Chen had everything to gain from Harmon staying alive

### Elena Vasquez ❌
- Hotel key access shows she was in the Press Room on floor 2 from 20:45 to 21:30
- Harmon's room is on floor 12 — different floor, verified by keycard log
- Sent a "story going live" email at 18:30 — she was chasing a story, not committing murder
- No connection to RH-7749 or NovaPharma internally

### Sofia Reyes ❌
- Took the 16:52 train from Davos to Zurich — confirmed by SBB booking reference SBB-44219
- Boarded flight LX439 at 18:12 from Zurich — boarding pass confirmed
- Was in the air to Tokyo when Harmon died
- The Cayman Islands transfers look suspicious but are tax optimization (emails with KPMG confirm this)
- Board decision to fire her was scheduled for January 20 — she had motive but zero opportunity

---

## The Evidence Chain Against Marcus

| # | Evidence | Table | Key Query Technique |
|---|---|---|---|
| 1 | Entered room 1204 at 20:25 — before Harmon returned | hotel_key_access | WHERE + time filter |
| 2 | Sold $3.4M of stock the day before the murder | stock_trades | JOIN + calculation |
| 3 | Every sell preceded a bad announcement by 1–3 days | stock_trades + company_decisions | JOIN on date range |
| 4 | Stole RH-7749 from lab on Jan 14 | lab_access_logs + drug_inventory | JOIN on access_date |
| 5 | Had clearance level 4 — only NovaPharma employee with access to RH-7749 on Jan 14 | research_clearance + lab_access_logs | JOIN + WHERE clearance_level >= 4 |
| 6 | Sent a deleted email about "RH-7749 confirmation" Jan 16 | emails | WHERE deleted = 1 |
| 7 | No travel record — stayed in Davos, no alibi | travel_records | absence of rows |
| 8 | Instagram post with MANUAL location tag — not GPS | social_media_posts | noise / red herring |

---

## The Logical Lock — Why You Can't Cheat

The final query requires ALL THREE of:
1. Person who accessed room 1204 BEFORE Harmon returned (access_time < 21:15, entry only)
2. Person who sold > $1M of stock on 2024-01-16
3. Person who accessed the lab on 2024-01-14 AND had clearance level ≥ 4

Only Marcus satisfies all three. Sofia and Okafor also accessed the lab on Jan 14, but their clearance levels (3 and 2) were too low for RH-7749. Harmon had level 5 clearance but is the victim.

---

## Key Data Points to Keep Consistent

- Harmon last seen at bar: **20:30**
- Marcus enters 1204: **20:25** (Harmon is at bar — room is empty)
- Marcus exits 1204: **20:48**
- Harmon returns to room: **21:18**
- Okafor enters: **21:34**
- Okafor exits: **21:59**
- Time of death: **21:50** (window: 21:40–22:00)
- RH-7749 onset: **60–90 minutes** → administered ~20:20–20:50 → consistent with Marcus's visit
- Marcus's stock sale: **2024-01-16** (day before murder), $3,401,000
- Lab theft: **2024-01-14**, last_access_date = 2024-01-14, quantity 50 → 49
- Sofia (person_id=2) and Okafor (person_id=6) also accessed lab on Jan 14 — noise rows requiring clearance cross-reference to eliminate

---

## Red Herrings Summary

| Red Herring | Table | What It Looks Like | Why It's Nothing |
|---|---|---|---|
| Sofia's Cayman transfers | transactions | Money laundering / bribery | Tax optimization, confirmed by KPMG emails |
| Okafor's NDA emails | emails | Blackmail motive | Legal dispute unrelated to murder |
| Chen's acquisition contract | contracts | $800M motive | Deal initiated by Harmon — Chen loses if Harmon dies |
| Elena's dinner for 2 | restaurant_receipts | Secret meeting | Dinner with her NYT editor |
| Marcus's Instagram post | social_media_posts | Alibi outside hotel | Manual location tag, not GPS — proves nothing |
| Sofia's hotel keycard at 21:10 | hotel_key_access | Still in Davos? | Remote check-in system — she was mid-flight |
