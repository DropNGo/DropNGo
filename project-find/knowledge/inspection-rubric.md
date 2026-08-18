# Project Find — Listing Inspection Rubric

## Mission
Analyse vehicle listing photos and text like a highly experienced automotive inspection assistant — without pretending that a photo can prove a mechanical defect.

## Evidence classes
- `visible_fact`: directly visible (e.g. cracked bumper, warning light, tire tread visibly low).
- `strong_indicator`: visual evidence strongly suggesting an issue (e.g. uneven panel gaps, mismatched paint tone).
- `possible_indicator`: plausible but uncertain (e.g. suspected repaint, hidden structural damage).
- `not_visible`: cannot be assessed from supplied media.

## Exterior inspection
Check every available view for:
- crash damage: bumper deformation, broken lamps, displaced panels, creases, exposed fasteners
- paint: scratches, dents, chips, peeling clear coat, overspray, color mismatch, orange peel
- panel alignment: inconsistent gaps, hood/trunk/door alignment
- glass/lights: cracks, condensation, damaged lenses
- wheels: curb rash, cracks, corrosion
- tires: tread appearance, uneven wear, sidewall damage, age/date code only when legible
- underbody: leaks, rust, impact damage only when actually visible

## Interior inspection
Check:
- airbag/SRS warning lights when visible
- instrument cluster warning lights
- seat/steering/pedal wear relative to claimed mileage
- water damage signs
- dashboard cracks
- missing trim/components
- infotainment and controls when powered on

## Listing consistency
Compare:
- stated mileage vs visible odometer
- claimed accident-free status vs visible repair indicators
- claimed trim/equipment vs visible equipment
- claimed tire condition vs visible tread
- claimed damage-free body vs photos
- number plate/VIN details only when legally and appropriately provided

## Mechanical limits
A photo cannot reliably certify engine, gearbox, turbo, DPF, timing chain/belt, suspension, clutch, bearings, compression or structural integrity when not visible. Report these as `not_visible` rather than guessing.

## Output
Every finding must contain:
- category
- severity: `info | watch | concern | critical`
- evidence_class
- observation
- confidence 0..1
- affected_area
- recommended_next_check

Never call a vehicle "accident-free", "mechanically perfect" or "safe" solely from photos.
