# Project Find — Vehicle Knowledge Layer

## Principle
Do **not** hardcode one "base car". Build a canonical vehicle ontology that lets the engine resolve any vehicle mentioned by a user or found in an advertisement into a stable identity.

Canonical identity:
`make → model → generation → body style → trim/variant → engine → fuel → drivetrain → transmission → market/year`

The ontology is the semantic bridge between messy human language and structured vehicle data.

## What the resolver must understand
- Brand aliases: `Mercedes`, `Mercedes-Benz`, `Benz`
- Model aliases: `E-Klasse`, `E-Class`, `W213`, `E 220 d`
- Generations/codes: `W204`, `W205`, `W206`, `F32`, `G20`, etc.
- Engine naming: `220d`, `2.0 TDI`, `330d`, `CRDi`, `CDI`
- Power in PS/kW/hp
- Body: sedan, limousine, coupe/coupé, estate/Kombi, SUV, hatchback, cabrio
- Fuel: diesel, petrol/benzin, hybrid, plug-in hybrid, electric
- Transmission: manual, automatic, DCT, DSG, CVT
- Drivetrain: FWD, RWD, AWD/4MATIC/xDrive/quattro
- Year ranges and facelifts
- Market-specific naming

## Confidence rule
Every resolved identity gets a confidence score and evidence. Never silently convert an uncertain match into a fact.

## Knowledge sources
Use a canonical knowledge source for identity/relationships, then use live web/listing sources for current prices, availability and seller claims. Wikidata's Query Service provides a programmatic SPARQL endpoint and is useful as one broad knowledge backbone; it is not a substitute for live vehicle listings. citeturn0search1turn0search3

## Separation
Vehicle knowledge answers: "What vehicle is this?"
Research answers: "What is available right now?"
Verification answers: "Can we trust this listing?"
Ranking answers: "How well does it satisfy this user's request?"

Never mix these layers.