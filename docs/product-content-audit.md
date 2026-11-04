# Product content audit

Reviewed 9 October 2026. Scope: all 32 existing products and the shared detail page.

## Editorial decisions

Each product now has a short description and a compact table containing meaningful product-type details. Buying guidance and enquiry requirements are selected by a more specific profile than the four navigation categories. These are editorial definitions and application guidance, not supplier-approved datasheets.

Removed repeated product/category/description rows, blanket unknown-value rows, information-status rows, image/packaging research notes, generic FAQs and technical-reference blocks from the customer page. The quotation note appears once. Research provenance lives here instead.

No Kraus stock sizes, GSM ranges, pack counts, certifications, chemical exclusions, adhesion values, image-life guarantees or commercial terms were established by the reference website. Those claims are omitted. A4 dimensions describe the nominal format; they do not certify an inspected batch. Existing IDs, titles, images and category filters remain intact.

## Sources and reliability

- [Kowloon mobile homepage](https://m.kowloonpapergroup.com/): starting reference. Product lists sometimes return empty/template content, so desktop and indexed detail pages were also examined.
- [Kowloon catalogue](https://kowloonpapergroup.com/Products_wkobjc.html): product-title cross-check across the four categories. Titles establish a reference product type, not a Kraus supply agreement.
- [Printing paper catalogue](https://www.kowloonpapergroup.com/products/Printing-Paper/): sheet families and reference names. Multiple similarly named office papers have no reliable SKU distinctions beyond presentation.
- [White kraft listing](https://www.kowloonpapergroup.com/products/Printing-Paper/Large-Size-Flat-Paper_1553936/Large-Size-Flat-Paper_1636025.html): title weights conflict with the copied office-paper table. Do not import its copy-paper size, brightness, opacity or packing values into kraft specifications.
- [Small thermal rolls](https://kowloonpapergroup.com/products/Thermal-Paper/Ordinary-Thermal-Paper/Supplier-Price-Thermal-Paper-Roll-57x30-57x40.html): title names receipt-roll sizes, but body discusses adhesive labels. Retain the receipt product type; omit unverified dimensional values and label construction.
- [Thermal jumbo rolls](https://www.kowloonpapergroup.com/products/Paper-Roll/Thermal-Paper-Roll_1532467/Thermal-paper-roll_1637841.html): inconsistent title/table grammages and small finished-roll dimensions in a jumbo listing. Do not use those as parent-roll dimensions, or transfer BPA-free and image-life claims.
- [Coloured parent rolls](https://m.kowloonpapergroup.com/goods/Large-Colorful-Paper-Rolls/Colored-large-rolls-of-tissues---red-and-black-tissues.html): title mentions tissue, table describes generic print paper. Keep the existing broad paper-roll identity; do not infer tissue ply or furnish.
- [Kowloon bonding tape](https://kowloonpapergroup.com/products/Adhesive-Tape/3M-Tape-1.html): conflicting masking/bonding uses, adhesive types and material claims. No brand, model or measured performance transferred.
- [3M 5952 technical data](https://multimedia.3m.com/mws/media/2366487O/3m-vhb-tape-5952.pdf?fn=3M-VHB-Tape-5952.pdf): manufacturer identifies acrylic foam, illustrating why the reference EVA/rubber table is unreliable. This is not evidence that Kraus supplies 3M tape.
- [Zebra print methods](https://docs.zebra.com/us/en/printers/desktop/gk420t-desktop-thermal-printer-user-guide/t-gk420d-ug-print-operations/t-gk420d-ug-modes-of-printing.html): direct thermal versus ribbon-based thermal transfer.
- [Zebra thermal-media identification](https://support.zebra.com/article/000012917): adhesive format alone does not establish the print method.
- [Zebra media setup](https://cpws.zebra.com/cpws/docs/znet2/webpage/Media_Setup.htm): label sensing and print-method setup guidance.
- [Zebra thermal-printing comparison](https://prod-www.zebra.com/us/en/resource-library/faq/difference-between-direct-thermal-and-thermal-transfer-printing.html): thermal-image sensitivity to heat and light.
- [ISO 216 overview](https://www.iso.org/standard/36631.html): trimmed paper-format context; no product certification claimed.

## Product-by-product disposition

| Product ID | Useful retained or added details | Omitted or unresolved |
| --- | --- | --- |
| coloured-adhesive-tape | Roll format, coloured appearance, identification uses | Exact colours, backing, adhesive and dimensions |
| transparent-bonding-tape | Transparent bond line, joining application | Brand, model, sidedness and strength |
| custom-adhesive-tape | Application-specific bonding brief | Unsupported assumption that custom means printed packing tape |
| bonding-tape | Joining surfaces, substrate and load selection | Conflicting reference chemistry and performance |
| clear-tape-roll | Clear roll, light sealing and wrapping | Heavy-duty or optical-performance claims |
| bopp-packing-tape | BOPP backing expanded, carton-sealing application | Adhesive chemistry and thickness |
| custom-packing-tape | Carton closure and artwork enquiry | Guaranteed printing options or minimum order |
| general-purpose-adhesive-tape | Routine securing and removal considerations | Universal surface compatibility |
| direct-thermal-barcode-label-rolls | Direct thermal method, no ribbon, barcode use | Adhesive formulation and label sizes |
| thermal-paper-rolls | Continuous receipt media and direct thermal method | Unverified 57 x 30 / 57 x 40 sizes |
| pos-receipt-thermal-rolls | POS receipts and printer-fit requirements | Unverified 80 x 80 size and roll length |
| custom-thermal-label-roll | Label layout, thermal method, custom brief | Red colour inferred from an image |
| coloured-adhesive-thermal-label-rolls | Coloured face, adhesive format, print contrast | Unverified permanent adhesive and shade range |
| supermarket-price-label-rolls | Retail price labels, printer/sensor fit | 60 GSM claim inconsistent with source face-paper weights |
| self-adhesive-label-rolls | Adhesive format, explicit print-method selection | Ambiguous copper-coated wording; automatic direct-thermal assumption |
| thermal-paper-receipt-converting-rolls | Parent format, slitting/rewinding, end product | Pallet-image notes and machine-size assumptions |
| coloured-jumbo-paper-rolls | Coloured parent format and converting process | Tissue grade, ply and wood-pulp claims |
| red-jumbo-paper-rolls | Red variant, parent format and shade matching | Tissue construction and colourfastness |
| thermal-paper-jumbo-rolls | Thermal parent stock and converting requirements | Conflicting GSM range, receipt-sized parent dimensions |
| white-jumbo-thermal-paper-rolls | White thermal jumbo format | Image-life and chemical-exclusion claims |
| receipt-paper-parent-rolls | Parent format and finished receipt-roll application | Image machinery description, unverified grade |
| white-a4-copy-paper-green-pack | White A4, nominal 210 x 297 mm, office uses | Packaging provenance and implied brand |
| a4-copy-paper-red-white-pack | A4 format, nominal dimensions, copying | Unverified recycled content |
| a4-paper-commercial-office | A4 format, dimensions, business documents | Packaging provenance and blanket commercial-press compatibility |
| everyday-office-copy-paper | Cut-sheet format and everyday documents | A4, 80 GSM and 500-sheet pack not independently mapped |
| large-size-flat-paper | Large sheets, press layout and grain direction | Stock size range and substrate assumptions |
| single-side-pe-coated-flat-paper | PE meaning and one-side construction | Food-contact approval, heat-seal performance and coating weight |
| white-kraft-paper-sheets | White kraft identity and sheet uses | Conflicting 30–70 GSM vs copy-paper table |
| double-sided-cardboard | Both-face use and board selection | Coated-both-sides, corrugated construction and strength claims |
| glossy-cardboard-sheets | Glossy finish and presentation uses | 70/80/120 GSM copied as board specs; rigidity unresolved |
| coloured-craft-copy-paper | Coloured sheets, cutting/folding/printing | Unverified shades and printer compatibility |
| coloured-a4-printing-paper | A4 dimensions, coloured face and notices | Unverified 80 GSM |

## Evidence still needed for a full technical catalogue

Obtain a supplier datasheet or approved Kraus SKU sheet for each stocked grade, including actual dimensions, tolerances, grammage/caliper, pack count and application limits. Similar copy-paper, bonding-tape and thermal-parent listings cannot honestly be differentiated by performance from the available evidence; retain their URLs pending SKU mapping. Verify whether glossy stock is paper or board before renaming it. Check labelled thermal items against actual samples. Consolidate duplicate products only after that mapping.

Maintenance: edit `app/data/product-detail-content.php` for product details and `app/data/product-detail-profiles.php` for buying guidance. Add numeric stock specifications only with traceable SKU evidence; do not convert enquiry requirements into specification values.
