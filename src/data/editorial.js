export const editorial = {
  'thermal-paper-roll-size': {
    section: 'Receipt paper',
    label: 'Measurement guide',
    image: '/assets/images/editorial/receipt-roll-dimensions.svg',
    socialImage: '/assets/images/editorial/receipt-roll-dimensions.png',
    alt: 'Paper roll diagram identifying paper width, outside diameter and core opening',
    caption: 'Record all three measurements, then check them against the printer media specification. Diagram is illustrative and not to scale.',
    updated: '2026-11-04',
    summary: 'A matching paper width is only the starting point. Check the roll diameter, core and printer requirements together before ordering.',
    takeaways: ['Measure width across the paper, not along its length.', 'Check outside diameter and core dimensions independently.', 'Use the printer manual to confirm acceptable media and loading.'],
  },
  'thermal-jumbo-roll-specifications': {
    section: 'Paper converting',
    label: 'Specification guide',
    image: '/assets/images/editorial/parent-roll-specifications.svg',
    socialImage: '/assets/images/editorial/parent-roll-specifications.png',
    alt: 'Parent paper roll diagram with web width, roll diameter, core and unwinding direction',
    caption: 'Roll geometry is one part of the specification. Also agree grade, grammage, weight, winding and the converting-line limits. Diagram is not to scale.',
    updated: '2026-11-04',
    summary: 'Start with the finished product and the converting line. A parent roll must satisfy the machine limits as well as the paper-grade requirements.',
    takeaways: ['Specify the incoming web and the finished product separately.', 'Check width, core, diameter and maximum roll weight.', 'Agree coating orientation, winding and quotation units.'],
  },
};
export const sectionId = title => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const readingMinutes = guide => Math.max(1, Math.ceil(Object.values(guide.sections).join(' ').replace(/<[^>]+>/g, ' ').split(/\s+/).length / 200));
export const displayDate = value => new Intl.DateTimeFormat('en-GB', { day:'numeric', month:'long', year:'numeric', timeZone:'UTC' }).format(new Date(value+'T00:00:00Z'));
