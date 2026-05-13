# The Davos Affair — Hints System

## Design Rules
- Each hint narrows the investigation without naming the killer
- Hints are grouped by stage — only unlock the next stage after the player queries the relevant tables
- No hint ever mentions Marcus by name until the final confirmation
- Hints point to DATA, not to conclusions

---

## Stage 0 — Opening (given to player automatically)

**Hint 0.1** *(the only free hint)*
> "January 17, 2024. Davos, Switzerland. Richard Harmon, CEO of NovaPharma, was found dead in Room 1204 of Hotel Belvedere at 07:05. Official cause: cardiac arrest. The coroner flagged the case — toxicology results are pending. Harmon was last seen alive at the hotel bar at 20:30. You have access to the investigation database. Where do you start?"

---

## Stage 1 — Getting Oriented
*Unlocks after player queries: incident_reports OR coroner_reports*

**Hint 1.1**
> "The coroner's notes mention a compound by name. It may be worth finding out who had access to it."

**Hint 1.2**
> "The hotel's keycard system logs every room entry and exit. Every room. Every person. Every time."

**Hint 1.3**
> "Start with who was at the hotel that night. Not everyone at Davos stayed at the Belvedere."

---

## Stage 2 — Narrowing the Scene
*Unlocks after player queries: hotel_guests OR hotel_key_access*

**Hint 2.1**
> "Room 1204 was accessed more than once on January 17. Not all of those visits were by the victim."

**Hint 2.2**
> "The time of death matters. Someone who entered the room after the victim died cannot be the killer. But someone who entered before the victim returned — that's a different story."

**Hint 2.3**
> "The coroner noted the substance was delayed-acting. That changes the timeline significantly."

---

## Stage 3 — Investigating Suspects
*Unlocks after player queries: coroner_reports AND hotel_key_access*

**Hint 3.1 — Pointing toward alibis**
> "For each person who accessed Room 1204, ask yourself: where else were they that night? Phone calls, travel records, and keycard logs in other parts of the hotel can all confirm — or contradict — an alibi."

**Hint 3.2 — Pointing toward motive**
> "Not every motive is personal. Sometimes the reason is financial. Stock trades, bank transfers, and company decisions can reveal what someone stood to gain — or lose."

**Hint 3.3 — Pointing toward the weapon**
> "The compound found in Harmon's bloodstream was not commercially available. It came from inside NovaPharma. Someone with internal clearance took it. The lab keeps logs."

---

## Stage 4 — Eliminating Suspects
*Unlocks after player queries at least 2 of: travel_records, phone_calls, board_decisions, transactions*

**Hint 4.1 — After player investigates Okafor**
> "Entering a room is not the same as committing the crime. If the substance takes 60–90 minutes to act, when would it have been administered? Does that change who was in the room at the critical moment?"

**Hint 4.2 — After player investigates Chen**
> "A phone call has two ends — a caller and a receiver, each in a different location. If someone was on a call during the murder window, consider where both parties were."

**Hint 4.3 — After player investigates Elena**
> "The hotel has more than one floor. Keycard access records show not just which room — but which floor. That's worth checking."

**Hint 4.4 — After player investigates Sofia**
> "Travel leaves traces: train bookings, boarding passes, loyalty program timestamps. A person cannot be in two countries at the same time."

---

## Stage 5 — Closing In
*Unlocks after player has eliminated at least 2 suspects with evidence*

**Hint 5.1**
> "Someone at this hotel had access to the victim's room, access to the compound, and a financial reason to act before Davos ended. All three of those things are in the database."

**Hint 5.2**
> "Look at the stock trades table carefully. Not just what was traded — but when, relative to other events in the company. A pattern across multiple dates tells a different story than a single trade."

**Hint 5.3**
> "The lab access logs and drug inventory are linked by session_id. Cross-referencing them with research_clearance will tell you exactly who could have taken what — and when."

---

## Stage 6 — Final Confirmation
*Only shown after player runs a query that returns a single person matching all three criteria*

**Hint 6.1** *(pre-final)*
> "You're close. Three things place one person at the center of this: the room, the compound, and the money. Can you write a single query that requires all three?"

**Hint 6.2** *(confirmation — shown after correct final query)*
> "The evidence is complete. Room 1204 was accessed before Harmon returned. The compound was taken three days before the murder. The stock was sold the day before. One person. One case. Submit your answer."

---

## Hint Delivery Notes for Development

| Trigger | Show Hint |
|---|---|
| Player queries `incident_reports` | Stage 1 unlocks |
| Player queries `coroner_reports` | Hint 1.1 becomes available |
| Player queries `hotel_key_access` | Stage 2 unlocks |
| Player mentions or queries time of death | Hint 2.3 |
| Player queries `travel_records` for any suspect | Hint 3.1 |
| Player queries `stock_trades` | Hint 3.2 |
| Player queries `lab_access_logs` | Hint 3.3 |
| Player queries eliminating Okafor's alibi | Hint 4.1 |
| Player queries eliminating Chen | Hint 4.2 |
| Player queries eliminating Elena | Hint 4.3 |
| Player queries eliminating Sofia | Hint 4.4 |
| 2+ suspects eliminated | Stage 5 unlocks |
| Player queries all 3 evidence tables for same person | Hint 6.1 |
| Final query returns correct answer | Hint 6.2 |

---

## What Hints Never Reveal
- Marcus Webb's name
- That the killer entered before Harmon (until Stage 4 — and even then, indirectly)
- The specific stock sale amount
- The specific compound name (only the coroner report mentions it — player must find it themselves)
