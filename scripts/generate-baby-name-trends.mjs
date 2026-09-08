import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const sourceDirectory = process.argv[2];
if (!sourceDirectory) {
  throw new Error("Pass the directory containing boy_YYYY.csv and girl_YYYY.csv files.");
}

const root = path.resolve(import.meta.dirname, "..");
const popularNamesSource = await readFile(path.join(root, "app/popular-names-data.ts"), "utf8");

function namesFrom(sourceName) {
  const match = popularNamesSource.match(new RegExp("const " + sourceName + " = `([^`]+)`\\.split"));
  if (!match) throw new Error(`Could not read ${sourceName}.`);
  return match[1].split(",");
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

const namesBySex = {
  boy: namesFrom("boyNames"),
  girl: namesFrom("girlNames"),
};
const years = Array.from({ length: 10 }, (_, index) => 2016 + index);
const trends = {};

for (const [sex, names] of Object.entries(namesBySex)) {
  const rankingsByYear = new Map();
  for (const year of years) {
    const csv = await readFile(path.join(sourceDirectory, `${sex}_${year}.csv`), "utf8");
    const rows = csv.trim().split(/\r?\n/).slice(1);
    rankingsByYear.set(year, new Map(rows.map((row) => {
      const [rank, name] = row.split(",");
      return [name, Number(rank)];
    })));
  }
  for (const name of names) {
    const points = years.map((year) => ({ year, rank: rankingsByYear.get(year).get(name) ?? null }));
    const expectedCurrentRank = names.indexOf(name) + 1;
    if (points.at(-1)?.rank !== expectedCurrentRank) {
      throw new Error(`${name} has 2025 rank ${points.at(-1)?.rank}; expected ${expectedCurrentRank}.`);
    }
    trends[slugify(name)] = points;
  }
}

if (Object.keys(trends).length !== 200 || Object.values(trends).some((points) => points.length !== 10)) {
  throw new Error("Every baby-name profile must have exactly ten annual trend points.");
}

const output = `// Generated from U.S. Social Security Administration annual rankings.\n// Archived CSVs: github.com/aruljohn/popular-baby-names (source: ssa.gov/oact/babynames).\n// Run scripts/generate-baby-name-trends.mjs with the archived CSV directory to refresh.\nexport type BabyNameTrendPoint = { year: number; rank: number | null };\n\nexport const babyNameTrends: Record<string, BabyNameTrendPoint[]> = ${JSON.stringify(trends, null, 2)};\n`;

await writeFile(path.join(root, "app/baby-name-trends.ts"), output);
console.log(`Generated 10-year trends for ${Object.keys(trends).length} names.`);
