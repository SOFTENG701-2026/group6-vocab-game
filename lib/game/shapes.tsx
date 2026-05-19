const common = 'className="outline-drawing" viewBox="0 0 96 96" aria-hidden="true" focusable="false"';

const shapePaths: Record<string, string> = {
  apple: `<svg ${common}><path d="M48 28c10-12 24-6 28 7 5 15-4 37-20 44-5 2-11-1-16-1s-11 3-16 1C8 72-1 50 4 35c4-13 18-19 28-7 5 5 11 5 16 0Z"/><path d="M49 27c-1-10 5-17 15-19"/><path d="M50 19c-7-7-16-8-23-4"/></svg>`,
  banana: `<svg ${common}><path d="M18 31c18 28 43 40 69 16-8 28-45 47-73 8-9-13-7-24 4-24Z"/><path d="M19 31c7-7 14-9 22-8"/><path d="M84 47c4-1 7-4 8-8"/></svg>`,
  carrot: `<svg ${common}><path d="M45 22c9 14 17 31 23 52-20-6-37-14-52-23 8-15 17-24 29-29Z"/><path d="M45 22c2-10 8-15 18-16"/><path d="M45 22c-4-10-12-14-24-12"/><path d="M45 22c8-5 18-5 29 0"/><path d="M32 43l16 5"/><path d="M42 58l13 4"/></svg>`,
  grape: `<svg ${common}><circle cx="43" cy="29" r="12"/><circle cx="59" cy="33" r="12"/><circle cx="31" cy="44" r="12"/><circle cx="49" cy="47" r="12"/><circle cx="66" cy="51" r="12"/><circle cx="39" cy="64" r="12"/><circle cx="56" cy="68" r="12"/><path d="M50 18c4-9 12-12 22-9"/><path d="M48 20c-4-8-11-12-22-10"/></svg>`,
  pear: `<svg ${common}><path d="M49 22c10 0 16 9 14 19 12 7 19 20 16 34-4 18-20 25-31 25S21 93 17 75c-3-14 4-27 16-34-2-10 4-19 16-19Z"/><path d="M50 22c-1-8 4-14 13-16"/><path d="M49 19c-6-7-14-8-23-5"/></svg>`,
  corn: `<svg ${common}><path d="M48 12c16 14 22 37 10 71-2 5-18 5-20 0-12-34-6-57 10-71Z"/><path d="M22 46c8 11 15 22 21 38"/><path d="M74 46c-8 11-15 22-21 38"/><path d="M39 30h18M36 44h24M36 58h24M40 72h16"/></svg>`,
  orange: `<svg ${common}><circle cx="48" cy="52" r="34"/><path d="M49 18c0-9 6-15 16-16"/><path d="M48 18c-5-6-12-8-22-4"/></svg>`,
  tomato: `<svg ${common}><path d="M48 28c23 0 38 14 36 32-2 20-17 30-36 30S14 80 12 60c-2-18 13-32 36-32Z"/><path d="M48 28l-7-15 12 9 10-14 1 17 16-5-11 14"/><path d="M48 28l-18-8 8 15"/></svg>`,
  broccoli: `<svg ${common}><circle cx="33" cy="30" r="16"/><circle cx="50" cy="24" r="18"/><circle cx="67" cy="33" r="16"/><circle cx="43" cy="43" r="17"/><circle cx="61" cy="47" r="17"/><path d="M45 58c-5 9-9 18-11 28h28c-2-10-6-19-11-28"/><path d="M48 58v28"/></svg>`,
  watermelon: `<svg ${common}><path d="M12 34c5 30 29 48 68 43 7-1 10-9 6-15C70 37 43 26 12 34Z"/><path d="M19 42c16 17 37 25 63 24"/><path d="M43 53l2 7M57 57l2 7M30 47l2 7"/></svg>`,
  pineapple: `<svg ${common}><path d="M48 30c17 11 24 29 17 54-2 7-32 7-34 0-7-25 0-43 17-54Z"/><path d="M48 30c-5-9-12-15-21-18"/><path d="M48 30c0-11 4-19 11-25"/><path d="M48 30c7-9 15-14 26-14"/><path d="M35 48l26 26M61 48L35 74M33 61h30"/></svg>`,
  blueberry: `<svg ${common}><circle cx="48" cy="51" r="34"/><path d="M48 17l6 13 14-1-11 9 5 14-14-8-14 8 5-14-11-9 14 1 6-13Z"/></svg>`
};

export function ShapeMarkup({ id }: { id: string }) {
  const html = shapePaths[id] || shapePaths.apple;
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
