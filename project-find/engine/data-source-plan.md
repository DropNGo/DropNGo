# Vehicle knowledge source strategy

## Goal
Build a normalized vehicle knowledge layer that can recognize vehicles across natural-language queries and seller listings.

## Source tiers
1. Manufacturer/OEM material where legally accessible: strongest for official specifications and equipment.
2. Government/open vehicle datasets: useful for identity, VIN and standardized attributes.
3. Reputable structured vehicle databases: useful for cross-market normalization and missing fields.
4. Listing sources: used for current price, mileage, seller text, photos and equipment actually advertised.
5. Community/forum sources: useful only as secondary evidence for known issues; never treated as authoritative specifications.

## Important distinction
Vehicle facts and live listing facts are different entities. A 2018 model may have a 66 L tank in the general specification, while a specific listing may have a different engine/market variant. The resolver must attach every field to a variant and source.

## Initial open source candidates
- NHTSA vPIC provides free public APIs for manufacturer/model/VIN-oriented data. It is strongest for vehicles registered or intended for sale/import in the US, so it must not be treated as a complete European catalogue. See https://vpic.nhtsa.dot.gov/api/ and https://vpic.nhtsa.dot.gov/About.
- VehiclesDB provides an open taxonomy of makes/models, body types, year ranges and availability evidence under CC-BY 4.0; it explicitly is not a valuation or vehicle-history source.

## No hallucination rule
If sources disagree, retain both claims with provenance and confidence. Never silently pick a number just because it looks plausible.
