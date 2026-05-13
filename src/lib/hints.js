export const HINTS = [
  null,
  "The coroner flagged an unusual compound. Check `coroner_reports` — what was found in the toxicology screen? Then look at `hotel_key_access` — someone entered room 1204 before the body was discovered.",
  "The substance has a 60–90 minute onset. Harmon was last seen at the bar around 20:10. Someone accessed his room while he was away. Cross-reference timing in `hotel_key_access` with `hotel_guests`.",
  "You need to eliminate suspects. Check alibis: `travel_records`, `flights`, `boarding_passes`, `phone_calls`. And ask — who had access to the compound? See `lab_access_logs` and `research_clearance`.",
  "Sofia's financials look suspicious — but she was elsewhere. Chen's deal actually depended on Harmon being alive. Look at who had motive AND opportunity. Check `stock_trades` around January 16th.",
  "Three things will close the case: room access before 21:15, lab access for RH-7749, and a financial motive tied to Harmon's death. One suspect fits all three. Check `drug_inventory` for the stolen unit.",
  "You've found it. Trust the evidence.",
]

export function getHintStage(queriedTables) {
  const qt = queriedTables

  // Stage 6: player queried the final evidence tables (all three pillars)
  if (
    qt.has('hotel_key_access') &&
    qt.has('stock_trades') &&
    (qt.has('lab_access_logs') || qt.has('drug_inventory'))
  ) return 6

  // Stage 5: has core evidence + at least one more investigative table
  if (
    qt.has('coroner_reports') &&
    qt.has('hotel_key_access') &&
    (qt.has('stock_trades') || qt.has('lab_access_logs') || qt.has('drug_inventory') ||
     qt.has('travel_records') || qt.has('phone_calls') || qt.has('board_decisions') || qt.has('transactions'))
  ) return 5

  // Stage 4: queried alibi tables alongside keycard/hotel data
  if (
    (qt.has('travel_records') || qt.has('phone_calls') || qt.has('board_decisions') || qt.has('transactions')) &&
    (qt.has('hotel_key_access') || qt.has('hotel_guests'))
  ) return 4

  // Stage 3: cross-referenced coroner + keycard
  if (qt.has('coroner_reports') && qt.has('hotel_key_access')) return 3

  // Stage 2: started looking at hotel access/guests
  if (qt.has('hotel_guests') || qt.has('hotel_key_access')) return 2

  // Stage 1: looked at the initial incident or coroner data
  if (qt.has('incident_reports') || qt.has('coroner_reports')) return 1

  return 0
}

export function getNarrativeUpdates(queriedTables) {
  const updates = []
  if (queriedTables.has('coroner_reports')) {
    updates.push("The coroner's report confirms it: compound RH-7749, a delayed-acting neurotoxin developed in NovaPharma's own R&D lab. Onset: 60–90 minutes. Someone with lab clearance obtained it.")
  }
  if (queriedTables.has('hotel_key_access')) {
    updates.push("Keycard logs don't lie. Someone accessed room 1204 while Harmon was at the bar. The timestamp is your window.")
  }
  if (queriedTables.has('stock_trades')) {
    updates.push("Unusual trading activity detected: a large position closed two days after the death. Someone knew what was coming.")
  }
  if (queriedTables.has('lab_access_logs')) {
    updates.push("Lab access logs show an entry on January 14th — three days before the murder. The compound went missing that night.")
  }
  return updates
}
