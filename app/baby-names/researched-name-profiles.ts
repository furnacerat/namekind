export type NameResearchSource = {
  label: string;
  publisher: string;
  url: string;
  note: string;
};

export type ResearchedNameProfile = {
  slug: string;
  pronunciation: string;
  pronunciationNote: string;
  meaningContext: string;
  history: string;
  everydayFit: string;
  tradeoff: string;
  shortForms: string[];
  variants: string[];
  sources: NameResearchSource[];
};

const profiles: ResearchedNameProfile[] = [
  {
    slug: "daniel",
    pronunciation: "DAN-yuhl",
    pronunciationNote: "The familiar U.S. English pronunciation compresses the written three syllables into two clear beats.",
    meaningContext: "Daniel comes from the Hebrew Daniyyel. Its elements are commonly analyzed as din, meaning “to judge,” and el, meaning “God,” which produces the established interpretation “God is my judge.” Unlike many modern meaning claims, this one has a direct linguistic explanation rather than a symbolic association added later.",
    history: "The biblical Book of Daniel made the name familiar across Jewish and Christian traditions. It entered medieval English use, later became less common, and was revived after the Protestant Reformation. That long journey helps explain why Daniel feels traditional without belonging to only one generation or country.",
    everydayFit: "Daniel moves easily between a formal full name and the shorter Dan, Danny, or Dani. The strong opening consonant gives it definition, while the softer second beat keeps the full form approachable beside both short and long surnames.",
    tradeoff: "Its strength is familiarity: pronunciation and spelling rarely need explanation. That same familiarity can be a drawback for families seeking a name that immediately feels unusual, so a meaningful middle name may carry more of the personal distinction.",
    shortForms: ["Dan", "Danny", "Dani"],
    variants: ["Danilo", "Daniyal", "Daniela", "Danielle"],
    sources: [{ label:"Daniel — meaning, history, and language forms", publisher:"Behind the Name", url:"https://www.behindthename.com/name/daniel", note:"Summarizes the Hebrew roots, biblical use, historical revival, and international forms; the entry lists its underlying dictionaries and lexicons." }],
  },
  {
    slug: "ryan",
    pronunciation: "RYE-uhn",
    pronunciationNote: "Two syllables in standard U.S. English, with the stress on the first.",
    meaningContext: "Ryan began as an English-language use of the Irish surname Ó Riain. The older personal name Rian has an uncertain meaning. “Little king” is a traditional interpretation, connecting Irish rí, “king,” with a diminutive ending, but it should be presented as a long-standing theory rather than a settled translation.",
    history: "The surname-to-given-name shift took hold in the United States during the twentieth century. Ryan climbed steadily in the 1950s and 1960s, then accelerated after the 1970 film Ryan’s Daughter. Its decades of heavy use make it feel established even though its wide first-name use is relatively modern.",
    everydayFit: "Ryan is compact, phonetic for most English speakers, and difficult to shorten accidentally. The long opening vowel gives it energy, while the final n lets it pair cleanly with many surnames without sounding ornate.",
    tradeoff: "The spelling Ryan is widely recognized, but parents may encounter nearby forms such as Rian, Ryann, or Ryne. Families choosing it for Irish meaning should be comfortable explaining that “little king” is traditional and appealing, not linguistically certain.",
    shortForms: ["Ry"],
    variants: ["Rian", "Ryann", "Ryanne"],
    sources: [{ label:"Ryan — Irish surname origin and meaning debate", publisher:"Behind the Name", url:"https://www.behindthename.com/name/ryan", note:"Explains Ó Riain, the uncertain meaning of Rian, the traditional “little king” interpretation, and the name’s U.S. rise." }],
  },
  {
    slug: "dylan",
    pronunciation: "DIL-uhn",
    pronunciationNote: "DIL-uhn is standard in U.S. English; Welsh pronunciation is closer to DUL-an.",
    meaningContext: "Dylan is Welsh, built from elements connected with movement toward the tide or flow. It is often reduced online to “son of the sea,” but that phrase describes the name’s mythological association more than a literal word-for-word translation.",
    history: "In the Fourth Branch of the Mabinogi, Dylan is a son of Arianrhod who takes naturally to the sea. The name later became internationally familiar through Welsh poet Dylan Thomas; Bob Dylan adopted his stage surname in reference to the poet. Those layers give the name both specifically Welsh roots and broad modern recognition.",
    everydayFit: "Its two-syllable rhythm is relaxed and contemporary in English, while the Welsh history gives it more depth than a newly coined sound. Dylan usually needs no nickname and works especially well when the surname has a different ending sound.",
    tradeoff: "English and Welsh speakers may pronounce the first syllable differently, and Dillon is a familiar alternative spelling with a different surname history. If the Welsh connection is central, decide which pronunciation you intend and be ready to model it consistently.",
    shortForms: ["Dyl"],
    variants: ["Dillan", "Dillon"],
    sources: [{ label:"Dylan — Welsh elements, mythology, and later use", publisher:"Behind the Name", url:"https://www.behindthename.com/name/dylan", note:"Connects the name to Welsh dy and llanw, summarizes the Mabinogi story, and documents its spread through Dylan Thomas." }],
  },
  {
    slug: "olivia",
    pronunciation: "oh-LIV-ee-uh",
    pronunciationNote: "Four syllables in standard U.S. English, with the strongest stress on LIV.",
    meaningContext: "Olivia is strongly associated with the Latin oliva, “olive,” but its exact formation is not completely settled. Shakespeare used the spelling for a noblewoman in Twelfth Night, and scholars have proposed that he adapted the earlier Oliva or Oliver, or drew directly from the Latin word.",
    history: "Twelfth Night was written around 1602, when Olivia was still rare. The name remained in English use for centuries and rose sharply in the late twentieth century before reaching the top of the U.S. chart in 2019. Its current popularity combines literary history with a flowing sound that fits modern naming patterns.",
    everydayFit: "Olivia offers several natural short forms—Liv, Livvy, Livia, and Ollie—without requiring one. Its four syllables give it presence, so short middle names and surnames often create the cleanest rhythm.",
    tradeoff: "The main decision is popularity, not usability. Olivia is highly familiar and currently ranks first nationally, so families should decide whether widespread recognition feels reassuring or whether hearing the name often would lessen its appeal.",
    shortForms: ["Liv", "Livvy", "Livia", "Ollie"],
    variants: ["Oliwia", "Olívia", "Olivija"],
    sources: [{ label:"Olivia — Shakespearean use and olive association", publisher:"Behind the Name", url:"https://www.behindthename.com/name/olivia", note:"Reviews the competing formation theories, the Twelfth Night character, historical usage, and documented dictionaries behind the entry." }],
  },
  {
    slug: "abigail",
    pronunciation: "AB-ih-gayl",
    pronunciationNote: "Three syllables, with the opening syllable stressed and the final syllable sounding like “gale.”",
    meaningContext: "Abigail comes from the Hebrew Avigayil. The name combines av, “father,” and gil, “joy,” with a connecting element, producing “my father is joy.” That is more precise than the looser but common paraphrase “father’s joy.”",
    history: "The Old Testament Abigail is remembered as Nabal’s wife who later married King David. The name became common in English after the Protestant Reformation and was especially familiar among Puritans. After falling out of fashion, it returned strongly in the twentieth century.",
    everydayFit: "Abigail balances a formal three-syllable shape with an unusually broad nickname range: Abby, Abbie, Abi, and Gail all change the name’s everyday tone. The hard g in the final syllable gives the otherwise soft name a clear finish.",
    tradeoff: "Parents should decide whether they love Abigail itself or mainly one nickname, because others may shorten it automatically. The standard spelling is familiar, while alternative spellings often create more correction than distinction.",
    shortForms: ["Abby", "Abbie", "Abi", "Gail"],
    variants: ["Avigail", "Abigaíl", "Abigaëlle"],
    sources: [{ label:"Abigail — Hebrew roots and English history", publisher:"Behind the Name", url:"https://www.behindthename.com/name/abigail", note:"Breaks down the Hebrew elements, identifies the biblical bearer, and traces the name through Reformation and Puritan use." }],
  },
  {
    slug: "ava",
    pronunciation: "AY-vuh",
    pronunciationNote: "Two syllables in English. The same spelling has a different pronunciation in Persian.",
    meaningContext: "Ava should not be assigned one universal meaning. English Ava is commonly treated as a variant of Eve and therefore linked with “life.” A separate Persian name written آوا means “voice” or “sound.” A Germanic Ava also exists as a short form built from an element whose meaning is uncertain. These are distinct histories that happen to share a spelling.",
    history: "English Ava rose dramatically around the turn of the twenty-first century, though earlier bearers include actress Ava Gardner. Germanic records include a medieval saint and poet, while Persian Ava belongs to its own living language tradition. The shared modern spelling does not erase those separate routes.",
    everydayFit: "Ava is short, symmetrical, and easy to say in many English-speaking settings. Its open vowels make it flow, but they can blur into a vowel-heavy surname; saying the complete name aloud matters more than its three-letter simplicity suggests.",
    tradeoff: "The compact spelling is a practical strength, but the meaning must be chosen carefully. Families connecting Ava to Persian heritage should use the Persian meaning and pronunciation context, while English usage usually follows the Eve-related entry.",
    shortForms: ["Av", "Avie"],
    variants: ["Avah", "Eva", "Aviana"],
    sources: [
      { label:"Ava 1 — the English name", publisher:"Behind the Name", url:"https://www.behindthename.com/name/ava-1", note:"Treats English Ava as a variant of Eve and documents its modern rise." },
      { label:"Ava 2 and Ava 3 — Persian and Germanic entries", publisher:"Behind the Name", url:"https://www.behindthename.com/name/ava", note:"Separates the Persian “voice, sound” entry from a Germanic name with uncertain deeper meaning." },
    ],
  },
  {
    slug: "caleb",
    pronunciation: "KAY-lub",
    pronunciationNote: "Two syllables in standard U.S. English, with the stress on KAY.",
    meaningContext: "Caleb has a debated Hebrew etymology. One analysis relates it to kelev, “dog.” Another divides the form into elements meaning “all” and “heart,” producing the familiar “wholehearted” interpretation. “Faithful” is best understood as a symbolic association with those readings, not a simple uncontested translation.",
    history: "The biblical Caleb is one of the twelve spies sent into Canaan and, with Joshua, one of the two who lived to enter the Promised Land. English use grew after the Protestant Reformation, and Puritan families carried the name into seventeenth-century America.",
    everydayFit: "Caleb has an established biblical profile without sounding formal in daily speech. Its two beats and clear consonants are easy to call, and the less common Cale or Cal can work as informal short forms.",
    tradeoff: "The disputed meaning deserves more honesty than many baby-name summaries provide. Choose Caleb for its full history and sound, not solely because a website promises that it literally means “faithful.”",
    shortForms: ["Cale", "Cal"],
    variants: ["Kaleb", "Kalev"],
    sources: [{ label:"Caleb — competing Hebrew explanations and biblical use", publisher:"Behind the Name", url:"https://www.behindthename.com/name/caleb", note:"Presents both major etymology theories, the biblical account, and the name’s English and Puritan history." }],
  },
  {
    slug: "andrew",
    pronunciation: "AN-droo",
    pronunciationNote: "Two syllables in standard U.S. English, with stress on the first.",
    meaningContext: "Andrew is the English form of Greek Andreas. Andreas is connected to andreios, “manly” or “masculine,” itself derived from aner, “man.” Modern families may read strength into that history, but “strong” is an interpretation rather than the direct lexical meaning.",
    history: "In the New Testament, Andrew is the apostle described as Simon Peter’s brother. The name spread widely through the Christian world and was common in medieval Europe. Its many language forms—Andrés, André, Anders, Andrei, Andrea, and others—show how broadly the name traveled.",
    everydayFit: "Andrew can remain formal or shift naturally to Andy or Drew, two short forms with very different personalities. The full name has a crisp opening and rounded ending that works with most surname lengths.",
    tradeoff: "Andrew is internationally established and rarely misunderstood in English, but its gendered Greek root may matter to families who prioritize a neutral meaning. Also decide in advance whether automatic use of Andy or Drew would be welcome.",
    shortForms: ["Andy", "Drew", "Dru"],
    variants: ["André", "Andrés", "Andrei", "Anders"],
    sources: [{ label:"Andrew — Greek roots, apostle, and international forms", publisher:"Behind the Name", url:"https://www.behindthename.com/name/andrew", note:"Connects Andrew to Andreas and its Greek root, then documents historical and cross-language use with lexicon references." }],
  },
  {
    slug: "enzo",
    pronunciation: "ENT-so",
    pronunciationNote: "Italian uses a clear ts sound in the middle; French pronunciation is closer to EN-zo.",
    meaningContext: "Enzo does not have one verified literal meaning. It may preserve an old Italian form related to Heinz, may connect with the Germanic Anzo, or may function as a short form of names ending in -enzo, especially Lorenzo and Vincenzo. Claims that it simply means “ruler of the household” overstate an uncertain history.",
    history: "The name is long associated with Italian use and is also established in French. Enzo Ferrari gave it a strong twentieth-century cultural association. Modern parents increasingly use Enzo as a complete first name rather than only as a short form.",
    everydayFit: "Enzo is concise but more distinctive in sound than many four-letter choices. The z and Italian ts pronunciation give it energy, while the open final o makes it pair smoothly with many consonant-starting surnames.",
    tradeoff: "Families should decide whether they want the Italian ENT-so pronunciation or the simpler English EN-zo and expect both. Its uncertain etymology is not a weakness, but it means heritage, sound, and family connection are better reasons to choose it than a promised dictionary definition.",
    shortForms: ["Enz"],
    variants: ["Lorenzo", "Vincenzo", "Renzo"],
    sources: [{ label:"Enzo — disputed formation and modern short-form use", publisher:"Behind the Name", url:"https://www.behindthename.com/name/enzo", note:"Explains the Heinz and Anzo theories, use as a short form, Italian and French pronunciation, and the Enzo Ferrari association." }],
  },
  {
    slug: "evelyn",
    pronunciation: "EV-uh-lin",
    pronunciationNote: "EV-uh-lin is common in U.S. English; some British speakers use EEV-lin or EEV-uh-lin.",
    meaningContext: "Evelyn began as an English surname derived from the given name Aveline. Because the deeper history of Aveline is not fully settled, neat translations such as “desired child” should be treated cautiously. Its resemblance to Eve and Evelina influenced how later speakers understood and used it, but resemblance is not the same as origin.",
    history: "When Evelyn first became a given name in the seventeenth century, it was more often masculine. It later shifted strongly toward feminine use, was popular in the early twentieth century, and returned to the U.S. Top 10 in 2017. That history makes it both a surname name and a revived classic.",
    everydayFit: "Evelyn has a formal three-syllable shape in American speech and the easy nickname Evie. The consonant ending keeps it grounded beside soft middle names, while the alternate British pronunciations are worth noting in an international family.",
    tradeoff: "Its current popularity can make Evelyn feel less antique than its history suggests. Parents should also decide whether they prefer Evie, Eve, or the full name, because the nickname may appear quickly in everyday use.",
    shortForms: ["Evie", "Eve", "Evvie", "Lyn"],
    variants: ["Evaline", "Eveline", "Evelynn"],
    sources: [{ label:"Evelyn — surname origin, gender history, and revival", publisher:"Behind the Name", url:"https://www.behindthename.com/name/evelyn", note:"Traces Evelyn to the surname and Aveline, documents its earlier masculine use, and describes its twentieth- and twenty-first-century popularity." }],
  },
  {
    slug: "aiden",
    pronunciation: "AY-dun",
    pronunciationNote: "Two syllables in standard U.S. English, with the opening syllable stressed.",
    meaningContext: "Aiden is a modern English spelling of Aidan, the Anglicized form of Irish Aodhán. Aodhán comes from Old Irish Áedán, a diminutive of Áed, and is translated as “little fire.” The meaning belongs to that Irish name family rather than to the modern spelling by itself.",
    history: "The older Aodhán was borne by an early king of Dál Riata and by several early Irish saints. Aidan became familiar in modern English, while Aiden joined a large group of -den spellings in U.S. use. The spelling therefore combines old Irish roots with a distinctly modern English presentation.",
    everydayFit: "Aiden is phonetically simple for most U.S. readers and has a soft, even rhythm. It generally stays in full rather than shortening, which suits families who want the everyday name and formal name to match.",
    tradeoff: "Spelling is the practical question. Aidan, Aiden, Ayden, Aden, and Aydan can sound alike, so correction may be more common than pronunciation trouble. Aidan is closer to the established Irish Anglicization; Aiden is the modern English variant used here.",
    shortForms: ["Aid"],
    variants: ["Aidan", "Aodhán", "Ayden", "Aden"],
    sources: [
      { label:"Aiden — modern English variant", publisher:"Behind the Name", url:"https://www.behindthename.com/name/aiden", note:"Identifies Aiden as a variant of Aidan and maps the related spellings." },
      { label:"Aodhán — the Irish root and “little fire” meaning", publisher:"Behind the Name", url:"https://www.behindthename.com/name/aodha10n", note:"Traces the Irish form to Old Irish Áedán and cites Irish Names by Ó Corráin and Maguire." },
    ],
  },
  {
    slug: "adriel",
    pronunciation: "ad-ree-EL",
    pronunciationNote: "English pronunciation varies; Spanish commonly stresses the final syllable.",
    meaningContext: "Adriel comes from Hebrew elements meaning “flock” or “herd” and “God,” giving the direct interpretation “flock of God.” Because the final -el element also appears in many familiar biblical names, Adriel can sound recognizable even to people encountering the full name for the first time.",
    history: "In the Old Testament, Adriel is the man who marries Merab, a daughter of Saul. The name is biblical in origin but has also developed modern use in Brazilian Portuguese and Spanish-speaking communities, which gives it a broader contemporary life than its brief scriptural appearance might suggest.",
    everydayFit: "Adriel has three syllables, a light opening, and a stressed final beat. It resembles Adrian and Ariel on the page, so saying it clearly once may prevent confusion while preserving its more unusual identity.",
    tradeoff: "Pronunciation is the main decision: English speakers may try AY-dree-ul, AD-ree-ul, or ad-ree-EL. Families with a specific Spanish, Portuguese, or English pronunciation should choose it intentionally and expect to model that version.",
    shortForms: ["Adi", "Adri"],
    variants: ["Adriele"],
    sources: [{ label:"Adriel — Hebrew elements, biblical bearer, and modern usage", publisher:"Behind the Name", url:"https://www.behindthename.com/name/adriel", note:"Explains the Hebrew roots, identifies the biblical bearer, and records modern Portuguese and Spanish usage." }],
  },
];

const requiredTextFields = ["pronunciation", "pronunciationNote", "meaningContext", "history", "everydayFit", "tradeoff"] as const;
const seenSlugs = new Set<string>();
for (const profile of profiles) {
  if (seenSlugs.has(profile.slug)) throw new Error(`Duplicate researched baby-name profile: ${profile.slug}`);
  seenSlugs.add(profile.slug);
  for (const field of requiredTextFields) {
    if (!profile[field].trim()) throw new Error(`Missing ${field} in researched baby-name profile: ${profile.slug}`);
  }
  if (!profile.shortForms.length || !profile.variants.length || !profile.sources.length) {
    throw new Error(`Incomplete researched baby-name profile structure: ${profile.slug}`);
  }
  for (const source of profile.sources) {
    if (!source.label || !source.publisher || !source.url || !source.note) {
      throw new Error(`Incomplete source in researched baby-name profile: ${profile.slug}`);
    }
  }
}

export const researchedBabyNameSlugs = profiles.map(({ slug }) => slug);
export const researchedBabyNameBySlug = new Map(profiles.map((profile) => [profile.slug, profile]));
