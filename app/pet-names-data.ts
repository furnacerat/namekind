import type { NameItem } from "./name-data";

export type PetFit = "Dogs & cats" | "Especially dogs" | "Especially cats";
export type PetName = { name:string; slug:string; rank:number; pronunciation:string; origin:string; meaning:string; nicknames:string[]; fit:PetFit; style:string };

const raw = ([
  ["Luna","LOO-nah","Latin","Moon|Lulu,Lu","Dogs & cats","Celestial"], ["Max","MAKS","Latin","Greatest|Maxie","Dogs & cats","Friendly classic"],
  ["Bella","BEL-ah","Italian","Beautiful|Belle,Bells","Dogs & cats","Sweet & familiar"], ["Charlie","CHAR-lee","English","Free person|Char,Chaz","Dogs & cats","Human-style"],
  ["Milo","MY-loh","Germanic & Latin","Gracious; soldier|Miles,Mi","Dogs & cats","Playful vintage"], ["Daisy","DAY-zee","English flower name","Day's eye flower|Daze,Daisy Mae","Especially dogs","Nature"],
  ["Lucy","LOO-see","Latin","Light|Lu,Lulu","Dogs & cats","Bright classic"], ["Cooper","KOO-per","English occupational name","Barrel maker|Coop,Coopie","Especially dogs","Friendly surname"],
  ["Teddy","TED-ee","English","Gift of God; beloved nickname|Ted,Bear","Especially dogs","Cuddly classic"], ["Bailey","BAY-lee","English","Steward or bailiff|Bails,Bay","Dogs & cats","Gender-neutral"],
  ["Coco","KOH-koh","French nickname & word name","A lively affectionate nickname|Cokes,Coco Bean","Dogs & cats","Chic & playful"], ["Lily","LIL-ee","English flower name","Lily flower; purity|Lil,Lils","Dogs & cats","Gentle nature"],
  ["Leo","LEE-oh","Latin","Lion|Lee,Lele","Dogs & cats","Bold classic"], ["Nala","NAH-lah","Multiple origins","Meaning varies by language and tradition|Nals,Nala Bear","Dogs & cats","Regal & warm"],
  ["Rocky","ROK-ee","English nickname","Strong as a rock|Rock,Rocco","Especially dogs","Tough & spirited"], ["Sadie","SAY-dee","Hebrew via English","Princess|Sade,Sadie Mae","Dogs & cats","Vintage sweet"],
  ["Lola","LOH-lah","Spanish nickname","Sorrows; also an affectionate nickname|Lo,Lolo","Dogs & cats","Sassy vintage"], ["Buddy","BUD-ee","English word name","Friend and companion|Bud,Buds","Especially dogs","Classic pet"],
  ["Bear","BAIR","English word name","The strong woodland animal|Bear Bear,B","Especially dogs","Outdoorsy"], ["Stella","STEL-ah","Latin","Star|Stellie,Elle","Dogs & cats","Celestial classic"],
  ["Penny","PEN-ee","Greek via English","Weaver; also the coin word|Pen,Penny Lane","Dogs & cats","Cheerful vintage"], ["Tucker","TUK-er","English occupational name","Cloth fuller|Tuck,Tucky","Especially dogs","Energetic surname"],
  ["Winston","WIN-stun","English","Joyful stone or town|Winnie,Wins","Especially dogs","Distinguished"], ["Rosie","ROH-zee","Latin via English","Rose|Rose,Ro","Dogs & cats","Floral sweet"],
  ["Oliver","OL-ih-ver","Latin & French","Olive tree|Ollie,Ol","Dogs & cats","Polished classic"], ["Ruby","ROO-bee","Latin gem name","Red precious stone|Rue,Ruby Roo","Dogs & cats","Jewel-bright"],
  ["Finn","FIN","Irish","Fair or white|Finny,F","Dogs & cats","Crisp & adventurous"], ["Willow","WIL-oh","English tree name","Willow tree|Will,Willa","Dogs & cats","Gentle nature"],
  ["Murphy","MUR-fee","Irish surname","Sea warrior|Murph,Murf","Especially dogs","Irish & friendly"], ["Moose","MOOS","English animal name","The large woodland animal|Moo,Moosie","Especially dogs","Big & playful"],
  ["Pepper","PEP-er","English spice name","The lively spice|Pep,Peppy","Dogs & cats","Spunky word name"], ["Archie","AR-chee","Germanic via English","Genuinely brave|Arch,Archie Bear","Especially dogs","Vintage friendly"],
  ["Jack","JAK","English","God is gracious|Jackie,J","Dogs & cats","Crisp classic"], ["Chloe","KLOH-ee","Greek","Young green shoot|Chlo,Coco","Dogs & cats","Bright classic"],
  ["Millie","MIL-ee","Germanic via English","Gentle strength|Mill,Mills","Dogs & cats","Soft vintage"], ["Scout","SKOWT","English word name","One who explores|Scouty,Scout Scout","Dogs & cats","Adventurous"],
  ["Louie","LOO-ee","French & Germanic","Famous warrior|Lou,Lulu","Dogs & cats","Friendly classic"], ["Sophie","SOH-fee","Greek","Wisdom|Soph,Soso","Dogs & cats","Gentle classic"],
  ["Duke","DOOK","Latin title","Leader or noble title|Dukey,D","Especially dogs","Regal & bold"], ["Zoey","ZOH-ee","Greek","Life|Zo,Zozo","Dogs & cats","Bright & lively"],
  ["Ollie","OL-ee","English nickname","Olive tree; affectionate nickname|Ol,Olls","Dogs & cats","Playful classic"], ["Henry","HEN-ree","Germanic","Home ruler|Hank,Hen","Dogs & cats","Human-style classic"],
  ["Ellie","EL-ee","English nickname","Light; meaning varies with full form|Elle,Ells","Dogs & cats","Gentle & sweet"], ["Loki","LOH-kee","Old Norse mythology","The Norse trickster figure|Lokes,Lolo","Dogs & cats","Mischievous mythic"],
  ["Nova","NOH-vah","Latin","New; a star that brightens|Novie,No","Dogs & cats","Celestial modern"], ["Remi","REM-ee","French","Oarsman or remedy|Rem,Remy Roo","Dogs & cats","Modern human-style"],
  ["Roxy","ROK-see","Persian via English","Dawn|Rox,Roxy Roo","Dogs & cats","Bold & lively"], ["Blue","BLOO","English color name","The color blue|Blu,Blueberry","Dogs & cats","Cool word name"],
  ["Maggie","MAG-ee","Greek via English","Pearl|Mags,Magpie","Dogs & cats","Warm classic"], ["Bentley","BENT-lee","English place name","Bent-grass meadow|Bent,Benny","Especially dogs","Polished surname"],
  ["Simba","SIM-bah","Swahili","Lion|Sim,Simmy","Especially cats","Regal animal"], ["Cleo","KLEE-oh","Greek","Glory|Clee,Cece","Especially cats","Chic & ancient"],
  ["Ginger","JIN-jer","English spice name","The warm golden spice|Gin,Gigi","Dogs & cats","Spicy & warm"], ["Oscar","OS-kar","Irish & Norse","Deer friend; divine spear|Oz,Ozzie","Dogs & cats","Quirky classic"],
  ["Jasper","JAS-per","Persian","Treasurer|Jas,Jazzy","Dogs & cats","Vintage gemlike"], ["Shadow","SHAD-oh","English word name","A faithful dark silhouette|Shad,Shady","Dogs & cats","Mysterious"],
  ["Smokey","SMOH-kee","English word name","Smoke-colored|Smoke,Smokes","Dogs & cats","Cozy & classic"], ["Tigger","TIG-er","Literary character name","An energetic tiger name|Tig,Tiggy","Especially cats","Bouncy literary"],
  ["Mochi","MOH-chee","Japanese food name","Sweet rice cake|Mo,Momo","Dogs & cats","Food-inspired"], ["Oreo","OR-ee-oh","Cookie brand-inspired name","Black-and-white cookie|Ori,Reo","Dogs & cats","Food-inspired"],
  ["Peanut","PEE-nut","English food name","The small legume|Pea,Nutter","Dogs & cats","Tiny & playful"], ["Maple","MAY-pul","English tree name","Maple tree and its sweetness|Mae,Mapes","Dogs & cats","Cozy nature"],
  ["Honey","HUN-ee","English word name","Sweet golden honey|Hun,Honeybee","Dogs & cats","Affectionate"], ["Sunny","SUN-ee","English word name","Bright like the sun|Sun,Sunshine","Dogs & cats","Cheerful nature"],
  ["Poppy","POP-ee","English flower name","Poppy flower|Pop,Pops","Dogs & cats","Bright floral"], ["Olive","OL-iv","Latin & English","Olive tree; peace|Ollie,Liv","Dogs & cats","Nature vintage"],
  ["Ivy","EYE-vee","English plant name","Evergreen climbing vine|Ives,Vee","Dogs & cats","Botanical crisp"], ["Hazel","HAY-zul","English tree and color name","Hazel tree|Haze,Hazy","Dogs & cats","Woodland vintage"],
  ["Bruno","BROO-noh","Germanic","Brown|Bru,Brunie","Especially dogs","Strong classic"], ["Gus","GUS","Latin & Germanic nickname","Magnificent; great|Gussie,Gus Gus","Especially dogs","Compact vintage"],
  ["Harley","HAR-lee","English place name","Hare's meadow|Harls,Lee","Dogs & cats","Free-spirited"], ["Beau","BOH","French","Handsome|Bo,Bobo","Especially dogs","Charming classic"],
  ["Ranger","RAYN-jer","English word name","Forest guardian or roaming keeper|Range,Rangey","Especially dogs","Outdoorsy"], ["Hank","HANK","Germanic via English","Home ruler|Hanky,H","Especially dogs","Rugged classic"],
  ["Buster","BUS-ter","English nickname","A spirited fellow|Bust,Bussy","Especially dogs","Classic pet"], ["Lucky","LUK-ee","English word name","Fortunate|Luck,Lucky Duck","Dogs & cats","Optimistic"],
  ["Cody","KOH-dee","Irish surname","Helpful|Code,Coco","Especially dogs","Friendly human-style"], ["Dexter","DEKS-ter","Latin","Right-handed; skillful|Dex,Dexy","Especially dogs","Clever vintage"],
  ["Ace","AYS","English word name","One; expert|Acey,A","Especially dogs","Bold & crisp"], ["Apollo","ah-POL-oh","Greek mythology","God associated with music and light|Pollo,Apo","Especially dogs","Heroic mythic"],
  ["Thor","THOR","Old Norse mythology","Thunder|Thorby,T","Especially dogs","Powerful mythic"], ["Zeus","ZOOS","Greek mythology","Sky-god name|Z,Zuzu","Especially dogs","Regal mythic"],
  ["Koda","KOH-dah","Modern name; multiple associations","Meaning varies by origin and usage|Ko,Koko","Dogs & cats","Warm modern"], ["Bandit","BAN-dit","English word name","Playful outlaw|Bandy,Ban","Especially dogs","Mischievous"],
  ["Maverick","MAV-rik","English word name","Independent-minded person|Mav,Mavy","Especially dogs","Adventurous"], ["Marley","MAR-lee","English surname","Pleasant seaside meadow|Mar,Marls","Dogs & cats","Laid-back"],
  ["Toby","TOH-bee","Hebrew via English","God is good|Tobes,T","Dogs & cats","Friendly classic"], ["Benny","BEN-ee","Hebrew via English","Son of the right hand|Ben,Benji","Dogs & cats","Cheerful classic"],
  ["Brody","BROH-dee","Scottish surname","Ditch or muddy place|Bro,Brodes","Especially dogs","Sporty surname"], ["Oakley","OHK-lee","English place name","Oak clearing|Oak,Oaks","Dogs & cats","Nature surname"],
  ["Freya","FRAY-ah","Old Norse","Lady; Norse goddess name|Frey,Fifi","Dogs & cats","Mythic & graceful"], ["Phoebe","FEE-bee","Greek","Bright and radiant|Pheebs,Fee","Dogs & cats","Bright classic"],
  ["Winnie","WIN-ee","Welsh & English nickname","Fair, blessed, or gentle friend|Win,Winns","Dogs & cats","Cuddly vintage"], ["Frank","FRANK","Germanic","Free person|Frankie,Franko","Especially dogs","Human-style classic"],
  ["George","JORJ","Greek","Farmer|Georgie,G","Especially dogs","Distinguished classic"], ["Otis","OH-tis","Germanic","Wealth|Odie,Oat","Dogs & cats","Quirky vintage"],
  ["Goose","GOOS","English animal name","The lively water bird|Goosey,Gus","Dogs & cats","Quirky animal"], ["Ziggy","ZIG-ee","Germanic nickname","Victory; meaning varies by full form|Zig,Zigs","Dogs & cats","Energetic quirky"],
  ["Salem","SAY-lum","Hebrew & place name","Peace|Sal,Salem Bean","Especially cats","Mysterious place"], ["Callie","KAL-ee","Greek via English","Beautiful; meaning varies by full form|Cal,Cals","Especially cats","Friendly classic"],
] as Array<[string,string,string,string,PetFit,string]>).map(([name,pronunciation,origin,packed,fit,style]) => { const [meaning,nicks] = packed.split("|"); return [name,pronunciation,origin,meaning,nicks.split(","),fit,style] as [string,string,string,string,string[],PetFit,string]; });

export const petNames: PetName[] = raw.map(([name,pronunciation,origin,meaning,nicknames,fit,style], index) => ({ name, slug:name.toLowerCase().replace(/[^a-z0-9]+/g,"-"), rank:index+1, pronunciation, origin, meaning, nicknames, fit, style }));
export const petNameBySlug = new Map(petNames.map((item) => [item.slug,item]));

export const petNameItems: NameItem[] = petNames.map((item) => ({
  name:item.name, pronunciation:item.pronunciation, origin:item.origin, meaning:item.meaning, nicknames:item.nicknames,
  why:`${item.name} is a ${item.style.toLowerCase()} choice with a clear calling sound and plenty of personality.`,
  tags:[item.fit,item.style, item.name.length <= 4 ? "Short & crisp" : item.name.length <= 6 ? "Two syllables" : "Longer & flowing", "Established favorite"],
}));

export function relatedPetNames(item:PetName) {
  return petNames.filter((candidate) => candidate.slug !== item.slug).map((candidate) => ({ candidate, score:(candidate.fit === item.fit ? 3 : 0) + (candidate.style === item.style ? 5 : 0) + (candidate.name[0] === item.name[0] ? 1 : 0) + (Math.abs(candidate.name.length-item.name.length) <= 1 ? 1 : 0) })).sort((a,b) => b.score-a.score || a.candidate.rank-b.candidate.rank).slice(0,8).map(({candidate}) => candidate);
}
