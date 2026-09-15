import type { BabyNameTrendPoint } from "../baby-name-trends";
import type { PopularName } from "../popular-names-data";

type ProfileCard = {
  label: string;
  title: string;
  text: string;
};

type DecisionCheck = {
  title: string;
  text: string;
};

function popularityBand(rank: number) {
  if (rank <= 10) return "Top 10";
  if (rank <= 25) return "Top 25";
  if (rank <= 50) return "Top 50";
  return "Top 100";
}

function popularityContext(rank: number) {
  if (rank <= 10) {
    return "It is one of the most frequently chosen names in the country, so most people will recognize it immediately.";
  }
  if (rank <= 25) {
    return "It is firmly established among current favorites, with broad familiarity beyond the very top of the chart.";
  }
  if (rank <= 50) {
    return "It is familiar in current use while appearing less often than the names at the very top of the list.";
  }
  return "It sits within the national Top 100 while leaving more room for distinction than the chart-leading choices.";
}

function meaningTheme(meaning: string) {
  const value = meaning.toLowerCase();
  if (/tree|flower|forest|brook|meadow|moon|dawn|star|sea|tide|island|earth|woodland|fire|sky|heaven/.test(value)) return "Nature";
  if (/god|yahweh|christ|faith|oath|salvation|heard/.test(value)) return "Faith";
  if (/strong|brave|protector|defender|war|power|lion|ruler|chief|champion/.test(value)) return "Strength";
  if (/light|bright|shining|rainbow|clear|new|beginning|life|alive/.test(value)) return "Light & life";
  if (/joy|happy|blessed|grace|favor|beloved|love|pleasant|comfort|delight/.test(value)) return "Warmth";
  if (/son of|child of|daughter|descendant|family/.test(value)) return "Family line";
  if (/maker|player|worker|bowman|transporter|attendant|occupational/.test(value)) return "Occupation";
  if (/from |citizen|town|place|woman from|settlement/.test(value)) return "Place & heritage";
  return "Heritage";
}

function trendSummary(name: string, trend: BabyNameTrendPoint[]) {
  const first = trend[0]?.rank ?? null;
  const current = trend.at(-1)?.rank ?? null;
  if (first === null && current !== null) {
    return { label:"Newer momentum", text:`${name} entered the Top 1,000 during this ten-year view and now ranks #${current}.` };
  }
  if (first !== null && current === null) {
    return { label:"Outside the Top 1,000", text:`${name} moved outside the Top 1,000 after ranking #${first} in 2016.` };
  }
  if (first === null || current === null) {
    return { label:"Limited chart history", text:`${name} does not have a rank in every year of this ten-year view.` };
  }
  const change = first - current;
  if (change >= 10) return { label:"Rising", text:`${name} rose ${change} places between 2016 and 2025.` };
  if (change <= -10) return { label:"Easing", text:`${name} moved down ${Math.abs(change)} places between 2016 and 2025.` };
  return { label:"Steady", text:`${name} stayed within ${Math.abs(change)} places of its 2016 rank through 2025.` };
}

function shapeDescription(name: string) {
  const length = name.length;
  const ending = name.at(-1)?.toUpperCase();
  const openEnding = /[AEIOY]/i.test(name.at(-1) ?? "");
  if (length <= 4) {
    return `${name} has a compact ${length}-letter form and ${openEnding ? "an open vowel ending" : `a defined ${ending} ending`}. That concise shape leaves room for a longer middle or surname.`;
  }
  if (length <= 6) {
    return `${name} has a balanced ${length}-letter form and ${openEnding ? "a soft, open ending" : `a clear ${ending} finish`}. It can carry either a short or substantial middle name.`;
  }
  return `${name} has a substantial ${length}-letter form and ${openEnding ? "a flowing vowel ending" : `a firm ${ending} finish`}. A concise middle name can give the full combination breathing room.`;
}

function originCheck(item: PopularName) {
  const nuanced = /multiple|debated|varies|uncertain|usage|possibly|associated/i.test(`${item.origin} ${item.meaning}`);
  if (nuanced) {
    return `Sources or traditions do not always tell one simple story for ${item.name}. If its heritage matters to you, confirm the meaning and pronunciation with a source specific to the language or community you want to honor.`;
  }
  return `${item.name} is generally connected with ${item.origin.toLowerCase()} roots. If that heritage is part of your choice, look beyond the short definition and learn how the name is pronounced and used within that tradition.`;
}

export function buildNameProfileContent(item: PopularName, trend: BabyNameTrendPoint[]) {
  const trendInfo = trendSummary(item.name, trend);
  const band = popularityBand(item.rank);
  const popularity = popularityContext(item.rank);
  const theme = meaningTheme(item.meaning);
  const shape = shapeDescription(item.name);
  const originGuidance = originCheck(item);
  const common = item.rank <= 25;

  const cards: ProfileCard[] = [
    {
      label: "Meaning",
      title: `${theme} at its center`,
      text: `The meaning most often associated with ${item.name} is “${item.meaning.toLowerCase()}.” That gives the name a story parents can explain without reducing it to a single definition.`,
    },
    {
      label: "Familiarity",
      title: `${band} in 2025`,
      text: popularity,
    },
    {
      label: "Full-name rhythm",
      title: item.name.length <= 4 ? "Compact and flexible" : item.name.length <= 6 ? "Balanced and adaptable" : "Substantial and flowing",
      text: shape,
    },
  ];

  const checks: DecisionCheck[] = [
    {
      title: "Decide how much popularity matters",
      text: common
        ? `${item.name} ranks #${item.rank}, so another child with the name is reasonably likely in a larger school or community. Decide whether that familiarity feels reassuring or too common for you.`
        : `${item.name} ranks #${item.rank}. Compare that national position with what you hear locally, because a name can feel more or less common in a particular community.`,
    },
    {
      title: "Confirm the cultural story",
      text: originGuidance,
    },
    {
      title: "Run the everyday-language test",
      text: `Say “This is ${item.name},” write it as if making an appointment, and imagine calling it from another room. Notice whether the spelling, sound, and likely nicknames still feel natural.`,
    },
    {
      title: "Test the complete name",
      text: `Pair ${item.name} with the surname, middle-name candidates, and any sibling names. Check the initials, repeated sounds, and the rhythm of the full name rather than judging the first name alone.`,
    },
  ];

  return {
    band,
    popularityContext: popularity,
    theme,
    trendInfo,
    shape,
    originGuidance,
    cards,
    checks,
    summary: `${item.name} is a ${item.origin.toLowerCase()} name commonly associated with “${item.meaning.toLowerCase()}.” At #${item.rank} in the 2025 U.S. rankings, it combines ${common ? "strong current familiarity" : "national recognition with a little more breathing room"} and a ${item.name.length <= 4 ? "concise" : item.name.length <= 6 ? "balanced" : "substantial"} written form.`,
  };
}
