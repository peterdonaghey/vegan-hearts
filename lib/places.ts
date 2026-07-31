export type PlaceType = "sanctuary" | "restaurant" | "shop" | "project" | "accommodation";

export type LocationPrecision = "exact" | "approximate";

export interface PlaceContact {
  email?: string; // include country code
  phone?: string;
  whatsapp?: string; // full international format
  instagram?: string; // @handle or URL
  facebook?: string; // Page URL
  telegram?: string;
  other?: string; // e.g. "via linktr.ee/xxx", "via Teaming"
}

export interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: PlaceType;
  subtypes: string[];
  description: string;
  website?: string;
  address: string;
  /** "exact" = verified street/plot-level. "approximate" = town/region centre, shown as such on the map */
  locationPrecision: LocationPrecision;
  /** At least ONE contact channel is required — the point of the map is connecting people */
  contact: PlaceContact;
  tags: string[];
  image?: string;
  /** Tracks data provenance - manual research, osm, community, social, etc */
  source: string;
  /** URL where existence + address were verified (website, FB page, IG profile, directory listing) */
  sourceUrl?: string;
}

/**
 * Vegan Hearts Map — Place Data
 *
 * A manually curated collection of animal sanctuaries and vegan projects worldwide.
 * Initially focused on Spain, Portugal & Taiwan. Growing through research and community submissions.
 *
 * To add a place: add an object to this array. The map auto-updates.
 * Rules: coordinates must come from geocoding a real address from a real source (sourceUrl),
 * locationPrecision must be "approximate" when only town/region is known,
 * and at least one contact channel is mandatory (the map exists to connect people).
 */
export const places: Place[] = [
  // ============================================================
  // SPAIN — GALICIA
  // ============================================================
  {
    id: "mino-valley",
    name: "Mino Valley Farm Sanctuary",
    lat: 42.5086,
    lng: -7.6424,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue"],
    description:
      "First farm animal sanctuary in Galicia. 50 acres of meadows and woodland in the Ribeira Sacra valley. Home to 230+ rescued animals — cows, pigs, goats, sheep, chickens, ducks, horses, and donkeys. Founded in 2013 by Abigail Geer.",
    website: "https://minovalley.org",
    address: "Pantón, Ribeira Sacra, Lugo, Galicia, Spain",
    locationPrecision: "exact",
    contact: {
      email: "info@minovalley.org",
      other: "via minovalley.org",
    },
    tags: ["vegan", "rescue", "volunteer", "farm_animal", "galicia"],
    source: "manual",
    sourceUrl: "https://minovalley.org",
  },
  {
    id: "o-viso-ecovillage",
    name: "O Viso Ecovillage",
    lat: 43.5271,
    lng: -7.6565,
    type: "accommodation",
    subtypes: ["ecovillage", "vegan_hotel", "restaurant"],
    description:
      "First 100% vegan rural tourism village in Galicia. Reconstructed traditional hamlet with 10 apartments, vegan restaurant serving local Galician cuisine, rescued galgos roaming free. Founded by Pascale Hardy on 12 forested hectares.",
    website: "https://ovisoecovillage.com",
    address: "Lugar O Viso 1, Ourol, A Mariña, Lugo, Galicia, Spain",
    locationPrecision: "exact",
    contact: {
      phone: "+34 682 614 714",
      other: "via ovisoecovillage.com",
    },
    tags: ["vegan", "ecovillage", "pet_friendly", "restaurant", "galicia"],
    source: "manual",
    sourceUrl: "https://ovisoecovillage.com",
  },
  {
    id: "acougo-refugio",
    name: "Acougo Refugio de Animales",
    lat: 43.2434,
    lng: -8.5498,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue"],
    description:
      "Farm animal sanctuary in Montemaior, A Laracha, opened in 2023 by actress Mara Collazo. Home to 70+ rescued animals on 6 hectares — cows, goats, sheep, pigs, horses and donkeys. First farm animal refuge in the Costa da Morte region. Vegan-aligned lifelong care.",
    website: "https://acougo.org",
    address: "Montemaior, A Laracha, A Coruña, Galicia, Spain",
    locationPrecision: "exact",
    contact: {
      other: "via acougo.org",
    },
    tags: ["vegan", "rescue", "volunteer", "farm_animal", "galicia"],
    source: "research",
    sourceUrl: "https://acougo.org",
  },
  {
    id: "frente-la-santuario",
    name: "Frente L.A. Santuario Animal",
    lat: 43.3263,
    lng: -7.6947,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue"],
    description:
      "Private rescue and recovery centre founded in 2016 in Vilalba by a vegan couple. 6 hectares of forest and pasture. Home to rescued farm animals — pigs, sheep, goats, chickens — plus dogs and cats with mobility issues. Operates through sponsorships and a solidarity store.",
    website: "https://www.frentela.org",
    address: "Vilalba, Lugo, Galicia, Spain",
    locationPrecision: "exact",
    contact: {
      other: "via frentela.org (solidarity store)",
    },
    tags: ["vegan", "rescue", "volunteer", "farm_animal", "galicia"],
    source: "research",
    sourceUrl: "https://www.frentela.org",
  },
  {
    id: "santuario-vacaloura",
    name: "Santuario Vacaloura",
    lat: 42.9237,
    lng: -8.1528,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue"],
    description:
      "Antiespecista animal sanctuary in Arzúa. 250+ animals — cows, pigs, goats, sheep, chickens, horses — rescued from exploitation and abandonment. Moved to a new permanent location in Arzúa in 2025. Operates through volunteer support and sponsorships. Promotes veganism.",
    website: "https://santuariovacaloura.org",
    address: "Arzúa, A Coruña, Galicia, Spain",
    locationPrecision: "exact",
    contact: {
      other: "via santuariovacaloura.org",
    },
    tags: ["vegan", "rescue", "volunteer", "farm_animal", "galicia", "antiespecista"],
    source: "research",
    sourceUrl: "https://santuariovacaloura.org",
  },
  {
    id: "savia-ecoaldea",
    name: "Savia Ecoaldea Vegana",
    lat: 43.5114,
    lng: -7.1267,
    type: "project",
    subtypes: ["ecovillage", "community"],
    description:
      "The first vegan agroecological cohousing project in Spain, in the Valle del Eo on the Galicia-Asturias border. A community built on veganism, permaculture, degrowth, and mutual support. Shared housing, organic vegan gardens, and a commitment to animal liberation. Accepts residents and visitors.",
    website: "https://www.saviaecoaldeavegana.com",
    address: "Valle del Eo, Ribadeo area, Galicia/Asturias border, Spain",
    locationPrecision: "approximate",
    contact: {
      other: "via saviaecoaldeavegana.com",
    },
    tags: ["vegan", "ecovillage", "community", "permaculture", "organic", "galicia", "asturias"],
    source: "research",
    sourceUrl: "https://www.saviaecoaldeavegana.com",
  },
  {
    id: "sueno-de-jill",
    name: "El Sueño de Jill",
    lat: 42.4310,
    lng: -8.6443,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue"],
    description:
      "Mini multi-species antiespecista sanctuary in Pontevedra run by Paula Cudeiro. Rescues animals from abuse, abandonment and exploitation. Home to 30+ animals — sheep, goats, rabbits, rats, dogs, cats. Actively promotes veganism through rescue and education.",
    address: "Pontevedra, Galicia, Spain",
    locationPrecision: "approximate",
    contact: {
      other: "via El Diario profile (sourceUrl) — no direct contact published",
    },
    tags: ["vegan", "rescue", "antiespecista", "farm_animal", "galicia"],
    source: "research",
    sourceUrl: "https://www.eldiario.es/el-caballo-de-nietzsche/mujeres-santuarios-animales_1_2042431.html",
  },
  {
    id: "val-de-rodas",
    name: "Val de Rodas Rewilding Project",
    lat: 42.4154,
    lng: -8.3866,
    type: "project",
    subtypes: ["rewilding", "permaculture"],
    description:
      "Rewilding and sustainable living initiative in the Galician mountains run by a non-profit NGO. Restoring a ruined village, removing eucalyptus for native woodland regeneration, growing organic food with a vegan permaculture philosophy. Offers volunteer stays with vegan meals.",
    address: "A Lama, Pontevedra, Galicia, Spain",
    locationPrecision: "approximate",
    contact: {
      other: "via Workaway host 6771814384ae",
    },
    tags: ["vegan", "rewilding", "permaculture", "volunteer", "galicia"],
    source: "research",
    sourceUrl: "https://www.workaway.info/en/host/6771814384ae",
  },

  // ============================================================
  // SPAIN — CATALONIA
  // ============================================================
  {
    id: "santuario-gaia",
    name: "Fundación Santuario Gaia",
    lat: 42.3128,
    lng: 2.3649,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue", "foundation"],
    description:
      "One of Spain's largest vegan farm animal sanctuaries. 50+ hectares in the Catalan Pyrenees. Home to 500+ rescued animals — cows, pigs, goats, sheep, chickens, horses, turkeys, and more. Founded in 2012 by Ismael López and Coque Fernández.",
    website: "https://fundacionsantuariogaia.org",
    address: "La Cabanya del Molladar s/n, Camprodon, Girona, Catalonia, Spain",
    locationPrecision: "exact",
    contact: {
      email: "contacto@fundacionsantuariogaia.org",
      phone: "+34 972 26 54 95",
    },
    tags: ["vegan", "rescue", "volunteer", "farm_animal", "catalonia", "foundation"],
    source: "manual",
    sourceUrl: "https://fundacionsantuariogaia.org",
  },
  {
    id: "almas-veganas",
    name: "Almas Veganas Santuario Animal",
    lat: 41.9818,
    lng: 2.8249,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue", "collective"],
    description:
      "Antiespecista, transfeminist and libertarian collective fighting for animal and land liberation. Runs a farm animal sanctuary in Girona. 12K followers on Facebook. No website — reachable via Facebook or phone.",
    address: "Girona, Catalonia, Spain",
    locationPrecision: "approximate",
    contact: {
      phone: "+34 648 92 71 29",
      facebook: "https://www.facebook.com/almasveganas",
    },
    tags: ["vegan", "sanctuary", "catalonia", "girona", "farm_animal", "rescue"],
    source: "social",
    sourceUrl: "https://www.facebook.com/almasveganas",
  },

  // ============================================================
  // SPAIN — ANDALUSIA & MURCIA
  // ============================================================
  {
    id: "santuario-la-candela",
    name: "Santuario La Candela",
    lat: 37.2698,
    lng: -6.0627,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue", "shelter"],
    description:
      "Vegan animal sanctuary on 60+ hectares near Doñana Natural Park. Rescues and rehabilitates farm animals, dogs, and cats. 400+ residents including cows, pigs, goats, sheep, horses, donkeys. Founded in 2010. Also runs vegan awareness programs.",
    website: "https://santuariolacandela.com",
    address: "La Puebla del Río, Sevilla, Andalusia, Spain",
    locationPrecision: "exact",
    contact: {
      phone: "+34 678 05 31 93",
      other: "via santuariolacandela.com",
    },
    tags: ["vegan", "rescue", "farm_animal", "volunteer", "andalusia"],
    source: "manual",
    sourceUrl: "https://santuariolacandela.com",
  },
  {
    id: "jacobs-ridge",
    name: "Jacobs Ridge Animal Sanctuary",
    lat: 38.0419,
    lng: -1.4907,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue", "charity"],
    description:
      "Vegan animal sanctuary in the mountains of Murcia. UK-registered charity. Home to 130+ rescued animals — 72 pigs plus cows, goats, sheep, donkeys, horses, and poultry. Focus on rescuing from the agricultural industry.",
    website: "https://jacobsridgeanimalsanctuary.com",
    address: "Near Mula, Murcia, Spain",
    locationPrecision: "exact",
    contact: {
      other: "via jacobsridgeanimalsanctuary.com",
    },
    tags: ["vegan", "rescue", "farm_animal", "charity", "murcia"],
    source: "manual",
    sourceUrl: "https://jacobsridgeanimalsanctuary.com",
  },
  {
    id: "el-hogar-de-gringa",
    name: "El Hogar de Gringa Microsantuario",
    lat: 36.7213,
    lng: -4.4214,
    type: "sanctuary",
    subtypes: ["farm_animal", "microsanctuary", "rescue"],
    description:
      "Non-profit microsanctuary project in Málaga. Rescues animals without speciesist distinctions — prioritising farm animals with scarce resources. Funded via PayPal, GoFundMe and Teaming (€1/month). No website — reachable via Instagram.",
    address: "Málaga, Andalusia, Spain",
    locationPrecision: "approximate",
    contact: {
      instagram: "https://www.instagram.com/_elhogardegringa",
      other: "via linktr.ee/elhogardegringa (PayPal, GoFundMe, Teaming)",
    },
    tags: ["vegan", "sanctuary", "andalusia", "malaga", "microsanctuary", "rescue"],
    source: "social",
    sourceUrl: "https://www.facebook.com/profile.php?id=100085393542685",
  },

  // ============================================================
  // SPAIN — VALENCIA
  // ============================================================
  {
    id: "santuario-compasion-animal",
    name: "Santuario Compasión Animal",
    lat: 38.9804,
    lng: -0.6894,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue"],
    description:
      "Farm animal rescue centre on 80 hectares in the sierra de Enguera, one of Valencia's green lungs. Home to 250+ animals rescued from exploitation, abuse and abandonment, living free in a quiet mountain setting. Run by Fundación Nueva Compasión.",
    website: "https://www.compasionanimal.org",
    address: "Sierra de Enguera, Enguera, Valencia, Spain",
    locationPrecision: "approximate",
    contact: {
      other: "via compasionanimal.org · Teaming (€1/month)",
    },
    tags: ["vegan", "sanctuary", "valencia", "farm_animal", "rescue"],
    source: "research",
    sourceUrl: "https://www.compasionanimal.org",
  },
  {
    id: "el-rebrot-de-la-vida",
    name: "El Rebrot de la Vida",
    lat: 39.4034,
    lng: -0.4029,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue"],
    description:
      "Protectora and small antiespecista home founded in 2013 in Catarroja. Gives a new life to abandoned, abused and farm animals — dogs, cats and permanent farm animal residents. 9.8K followers on Facebook, very active.",
    website: "https://elrebrotdelavida.wixsite.com/elrebrotdelavida",
    address: "Catarroja, Valencia, Spain",
    locationPrecision: "approximate",
    contact: {
      email: "elrebrotdelavida@gmail.com",
      facebook: "https://www.facebook.com/elrebrotdelavida",
      instagram: "https://www.instagram.com/el_rebrot_de_la_vida",
      other: "via Teaming · PayPal · Bizum",
    },
    tags: ["vegan", "sanctuary", "valencia", "farm_animal", "rescue"],
    source: "research",
    sourceUrl: "https://www.facebook.com/elrebrotdelavida",
  },
  {
    id: "el-refugio-de-perla",
    name: "El Refugio de Perla",
    lat: 38.5874,
    lng: -0.3111,
    type: "sanctuary",
    subtypes: ["farm_animal", "microsanctuary", "rescue"],
    description:
      "Small sanctuary in Relleu, Alicante province, founded in memory of Perla. No website — reachable via Instagram and Teaming.",
    address: "Relleu, Alicante, Spain",
    locationPrecision: "approximate",
    contact: {
      instagram: "https://www.instagram.com/elrefugiodeperla",
      other: "via Teaming (€1/month)",
    },
    tags: ["vegan", "sanctuary", "alicante", "microsanctuary", "rescue"],
    source: "social",
    sourceUrl: "https://www.instagram.com/elrefugiodeperla",
  },
  {
    id: "pollets-de-la-terreta",
    name: "Pollets de la Terreta",
    lat: 39.9373,
    lng: -0.1004,
    type: "sanctuary",
    subtypes: ["poultry", "rescue"],
    description:
      "Small animalist home in Vila-real, Castellón, founded to shelter birds rescued from the livestock industry — hens and roosters liberated from slaughter. Rescued survivors from slaughterhouse gates are often transferred here by València Animal Save.",
    address: "Vila-real, Castellón, Spain",
    locationPrecision: "approximate",
    contact: {
      email: "polletsdelaterreta@gmail.com",
      instagram: "https://www.instagram.com/polletsdelaterreta",
      other: "Bizum 611099103 · Teaming · PayPal",
    },
    tags: ["vegan", "sanctuary", "castellon", "poultry", "rescue"],
    source: "research",
    sourceUrl: "https://www.teaming.net/polletsdelaterreta",
  },
  {
    id: "refugio-caballo-espiritu-libre",
    name: "Refugio Caballo Espíritu Libre",
    lat: 40.2166,
    lng: -0.1710,
    type: "sanctuary",
    subtypes: ["equine", "rescue"],
    description:
      "Equine rescue in Atzeneta del Maestrat, Castellón — 'rescate de equinos y malinois'. Mostly horses plus other animals in need, offering them peace and a healthy life away from abuse and abandonment.",
    address: "Atzeneta del Maestrat, Castellón, Spain",
    locationPrecision: "approximate",
    contact: {
      phone: "+34 634 63 24 02",
      facebook: "https://www.facebook.com/refugiocaballo.espiritulibre.90",
      instagram: "https://www.instagram.com/caballos.espiritu.libre",
      other: "via Teaming · GoFundMe",
    },
    tags: ["vegan", "sanctuary", "castellon", "equine", "rescue"],
    source: "research",
    sourceUrl: "https://www.facebook.com/refugiocaballo.espiritulibre.90",
  },
  {
    id: "santuario-la-paloma-triste",
    name: "Santuario La Paloma Triste",
    lat: 40.3578,
    lng: 0.0242,
    type: "sanctuary",
    subtypes: ["pigeons", "rescue"],
    description:
      "Sanctuary in Albocàsser, Castellón for non-releasable feral pigeons — hundreds of 'peatonas', humanised and rescued birds. Dedicated to defending these mistreated and discriminated birds. Run by Myriam with volunteer support.",
    website: "https://es.lapalomatriste.org",
    address: "Albocàsser, Castellón, Spain",
    locationPrecision: "approximate",
    contact: {
      facebook: "https://www.facebook.com/SantuarioLaPalomaTriste",
      instagram: "https://www.instagram.com/lapalomatriste_santuario",
      other: "IBAN ES66 3058 7429 7927 2000 2519 · Teaming · apadrina una paloma",
    },
    tags: ["vegan", "sanctuary", "castellon", "pigeons", "rescue"],
    source: "research",
    sourceUrl: "https://www.facebook.com/SantuarioLaPalomaTriste",
  },
  {
    id: "la-granja-de-izhan",
    name: "La Granja de Izhan",
    lat: 39.4367,
    lng: -0.4656,
    type: "sanctuary",
    subtypes: ["farm_animal", "equine", "rescue"],
    description:
      "Sanctuary in the Torrent area, Valencia, rescuing farm animals and equines — 'rescatamos animales y sanamos corazones'. Hit by the 2024 DANA floods and rebuilt with community support. Donations via Bizum and IBAN.",
    address: "Torrent, Valencia, Spain",
    locationPrecision: "approximate",
    contact: {
      email: "lagranjadeizhan.santuario@gmail.com",
      facebook: "https://www.facebook.com/lagranjadeizhan",
      instagram: "https://www.instagram.com/lagranjadeizhan",
      other: "Bizum 676781805 · IBAN ES57 3159 0073 2329 7151 0827",
    },
    tags: ["vegan", "sanctuary", "valencia", "farm_animal", "equine", "rescue"],
    source: "social",
    sourceUrl: "https://www.facebook.com/lagranjadeizhan",
  },

  // ============================================================
  // SPAIN — BALEARIC ISLANDS
  // ============================================================
  {
    id: "eden-sanctuary",
    name: "Eden Sanctuary Mallorca",
    lat: 39.6134,
    lng: 2.8829,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue"],
    description:
      "Vegan animal sanctuary on Mallorca. Home to 50+ rescued farm animals including pigs, goats, sheep, donkeys, horses, and poultry. Provides forever homes for animals rescued from abuse, neglect, and the agricultural industry.",
    website: "https://edensanctuary.org",
    address: "Mallorca, Balearic Islands, Spain",
    locationPrecision: "approximate",
    contact: {
      other: "via edensanctuary.org (Patreon, PayPal)",
    },
    tags: ["vegan", "rescue", "farm_animal", "mallorca", "balearic"],
    source: "manual",
    sourceUrl: "https://edensanctuary.org",
  },

  // ============================================================
  // SPAIN — MADRID, CASTILLA-LA MANCHA & CASTILE-LEÓN
  // ============================================================
  {
    id: "santuario-vegan",
    name: "Fundación Santuario Vegan",
    lat: 40.3625,
    lng: -4.3987,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue", "foundation"],
    description:
      "Vegan farm animal sanctuary founded in 2011 near Madrid. Rescues and rehabilitates cows, sheep, goats, pigs, chickens, horses, and donkeys from the livestock industry. One of Spain's most established vegan sanctuaries. Runs volunteer and education programmes.",
    website: "https://santuariovegan.org",
    address: "San Martín de Valdeiglesias, Madrid, Spain",
    locationPrecision: "exact",
    contact: {
      facebook: "https://www.facebook.com/SantuarioVegan",
      other: "via santuariovegan.org (1.4M followers on Facebook)",
    },
    tags: ["vegan", "rescue", "farm_animal", "volunteer", "madrid", "foundation"],
    source: "research",
    sourceUrl: "https://santuariovegan.org",
  },
  {
    id: "leon-vegano",
    name: "Leon Vegano Animal Sanctuary",
    lat: 42.5987,
    lng: -5.5671,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue", "foundation"],
    description:
      "Vegan animal sanctuary in León, home to 130 rescued farm animals. Registered NGO (CIF G24656134). Currently fundraising to relocate. Runs volunteer programmes, sponsorships, and visit days. Found via Instagram #santuariovegano — active on social media and accepting donations via PayPal, Teaming and IBAN.",
    website: "https://www.leonveganoanimalsanctuary.org",
    address: "León, Castile & León, Spain",
    locationPrecision: "approximate",
    contact: {
      phone: "+34 695 193 554",
      instagram: "https://www.instagram.com/explore/tags/santuariovegano/",
      other: "via leonveganoanimalsanctuary.org · Teaming · PayPal · IBAN ES95 0049 4388 3028 9001 5697",
    },
    tags: ["vegan", "sanctuary", "leon", "castile-leon", "farm_animal", "rescue"],
    source: "social",
    sourceUrl: "https://www.leonveganoanimalsanctuary.org",
  },
  {
    id: "santuario-arthur-king",
    name: "Santuario de Animales Arthur King",
    lat: 39.8628,
    lng: -4.0273,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue"],
    description:
      "Farm animal sanctuary in the province of Toledo. Covers feeding and veterinary care for rescued farm animals. No website — active on Facebook with WhatsApp contact and Teaming fundraising.",
    address: "Toledo province, Castilla-La Mancha, Spain",
    locationPrecision: "approximate",
    contact: {
      email: "asocarthurking@gmail.com",
      whatsapp: "+34 607 970 969",
      facebook: "https://www.facebook.com/santuarioarthurking",
      other: "via teaming.net/santuariodeanimalesarthurking",
    },
    tags: ["vegan", "sanctuary", "toledo", "castilla-la-mancha", "farm_animal", "rescue"],
    source: "social",
    sourceUrl: "https://www.facebook.com/santuarioarthurking",
  },
  {
    id: "santuario-dharma",
    name: "Santuario Dharma",
    lat: 40.3677,
    lng: -5.1704,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue"],
    description:
      "Vegan animal sanctuary in the Sierra de Gredos, Ávila. More than 200 lives rescued since its beginnings, with 100+ animals from 11 species living there today. Promotes veganism and offers volunteer stays through Worldpackers.",
    website: "https://santuariodharma.es",
    address: "Sierra de Gredos, Ávila, Castile & León, Spain",
    locationPrecision: "approximate",
    contact: {
      email: "sanctuarydharma@gmail.com",
      phone: "+34 697 477 905",
      other: "via santuariodharma.es · Teaming",
    },
    tags: ["vegan", "sanctuary", "avila", "castile-leon", "farm_animal", "rescue"],
    source: "research",
    sourceUrl: "https://santuariodharma.es",
  },
  {
    id: "los-perros-negros-santuario",
    name: "Los Perros Negros Santuario",
    lat: 39.8559,
    lng: -4.0243,
    type: "sanctuary",
    subtypes: ["farm_animal", "microsanctuary", "rescue"],
    description:
      "Microsantuario antiespecista in the province of Toledo — 'rescatando, acogiendo, cuidando y mimando'. Small sanctuary with solidarity products shop and Teaming fundraising. Active on Instagram and Facebook.",
    website: "https://www.santuariolosperrosnegros.es",
    address: "Toledo province, Castilla-La Mancha, Spain",
    locationPrecision: "approximate",
    contact: {
      facebook: "https://www.facebook.com/asociacionlosperrosnegros",
      instagram: "https://www.instagram.com/los_perros_negros_santuario",
      other: "Teaming · IBAN ES52 0049 4049 8124 1405 7645",
    },
    tags: ["vegan", "sanctuary", "toledo", "castilla-la-mancha", "microsanctuary", "rescue"],
    source: "social",
    sourceUrl: "https://www.instagram.com/los_perros_negros_santuario",
  },
  {
    id: "refugio-los-abuelos",
    name: "Refugio Los Abuelos",
    lat: 39.0722,
    lng: -3.6144,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue"],
    description:
      "Sanctuary for farm animals and domestic animals in Daimiel, Ciudad Real, next to the Tablas de Daimiel National Park. Born from a group of volunteers rescuing abandoned and mistreated animals — horses, farm animals and more. Runs volunteer, sponsorship and adoption programmes.",
    website: "https://refugiolosabuelos.org",
    address: "Daimiel, Ciudad Real, Castilla-La Mancha, Spain",
    locationPrecision: "approximate",
    contact: {
      whatsapp: "+34 611 903 062",
      other: "via refugiolosabuelos.org · Teaming",
    },
    tags: ["vegan", "sanctuary", "ciudad-real", "castilla-la-mancha", "farm_animal", "rescue"],
    source: "research",
    sourceUrl: "https://refugiolosabuelos.org",
  },

  // ============================================================
  // SPAIN — EXTREMADURA
  // ============================================================
  {
    id: "ciudad-animal-brego",
    name: "Ciudad Animal Brego",
    lat: 40.1288,
    lng: -5.4627,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue", "foundation"],
    description:
      "Self-managed 'animal city' on 10 hectares in Villanueva de la Vera, Cáceres — a sustainable space where animals and humans live together. Home to ~100 rescued animals. Founded by Iratxo; backed by Fundación Planeta Verde with a solidarity shop and crowdfunding campaigns.",
    website: "https://www.fundacionbrego.org",
    address: "Villanueva de la Vera, Cáceres, Extremadura, Spain",
    locationPrecision: "approximate",
    contact: {
      email: "info@fundacionbrego.org",
      instagram: "https://www.instagram.com/ciudadanimalbrego",
      other: "Bizum 10934 · IBAN ES17 2100 5654 1502 0006 0345",
    },
    tags: ["vegan", "sanctuary", "extremadura", "caceres", "farm_animal", "rescue"],
    source: "research",
    sourceUrl: "https://www.fundacionbrego.org",
  },

  // ============================================================
  // SPAIN — ASTURIAS & CANTABRIA
  // ============================================================
  {
    id: "santuario-corazon-verde",
    name: "Santuario Corazón Verde",
    lat: 43.3341,
    lng: -5.3310,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue"],
    description:
      "Farm animal sanctuary relocated from Navarra to Piloña, Asturias in 2025. Rescues, rehabilitates, and provides permanent homes for cows, pigs, sheep, goats, and other animals exploited by the livestock industry. A vegan antiespecista space promoting respectful coexistence between species.",
    website: "https://www.santuariocorazonverde.org",
    address: "Piloña, Asturias, Spain",
    locationPrecision: "exact",
    contact: {
      other: "via santuariocorazonverde.org",
    },
    tags: ["vegan", "sanctuary", "asturias", "farm_animal", "rescue"],
    source: "research",
    sourceUrl: "https://www.santuariocorazonverde.org",
  },
  {
    id: "refugio-manada-cantabra",
    name: "Refugio Animal La Manada Cántabra",
    lat: 43.4024,
    lng: -3.9516,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue"],
    description:
      "Animal sanctuary founded in 2021 in Oruña de Piélagos, Cantabria. Rescues farm animals — cows, horses, goats, donkeys — seized by SEPRONA or abandoned, providing them a dignified home away from slaughter. Home to 50+ animals. Won a World Vegan Day award in 2024.",
    website: "https://www.refugioanimallamanadacanta.org",
    address: "Oruña de Piélagos, Cantabria, Spain",
    locationPrecision: "exact",
    contact: {
      other: "via refugioanimallamanadacanta.org",
    },
    tags: ["vegan", "sanctuary", "cantabria", "farm_animal", "rescue"],
    source: "research",
    sourceUrl: "https://www.refugioanimallamanadacanta.org",
  },

  // ============================================================
  // SPAIN — BASQUE COUNTRY / EUSKADI
  // ============================================================
  {
    id: "burrita-carmela",
    name: "Asociación Burrita Carmela",
    lat: 43.2168,
    lng: -2.7365,
    type: "sanctuary",
    subtypes: ["rescue", "donkey"],
    description:
      "Family-run non-profit founded in 2015 in Amorebieta, Bizkaia. Dedicated to the protection, rescue and care of donkeys. Currently home to 20+ equids. Runs awareness programmes on animal respect and dignified life for all sentient beings.",
    website: "https://www.burritacarmela.com",
    address: "Amorebieta, Bizkaia, Basque Country, Spain",
    locationPrecision: "exact",
    contact: {
      other: "via burritacarmela.com",
    },
    tags: ["vegan", "sanctuary", "bizkaia", "basque_country", "donkey", "rescue"],
    source: "research",
    sourceUrl: "https://www.burritacarmela.com",
  },
  {
    id: "la-vida-color-frambuesa",
    name: "Santuario La Vida Color Frambuesa",
    lat: 42.7980,
    lng: -2.9041,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue", "multispecies"],
    description:
      "Multispecies sanctuary founded in 2017 in Ribera Alta, Álava. Home to 150+ animals of 14 species — horses, donkeys, sheep, goats, pigs, hens, turkeys, ducks and more. Run by a vegan veterinarian. Combines rescue, rehabilitation and vegan awareness.",
    website: "https://lavidacolorframbuesa.org",
    address: "Ribera Alta, Álava, Basque Country, Spain",
    locationPrecision: "exact",
    contact: {
      other: "via lavidacolorframbuesa.org",
    },
    tags: ["vegan", "sanctuary", "alava", "basque_country", "farm_animal", "rescue"],
    source: "research",
    sourceUrl: "https://lavidacolorframbuesa.org",
  },
  {
    id: "paraiso-interespecie",
    name: "Santuario Paraíso Interespecie",
    lat: 42.8441,
    lng: -2.6821,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue"],
    description:
      "Antiespecista, anarcho-transferminist and libertarian sanctuary founded in 2018 in Álava. Rescues non-human animals from exploitation and abandonment — pigs, hens, pigeons, dogs and cats — offering them a dignified life. Promotes animal rights from an intersectional perspective.",
    website: "https://paraisointerespecie.com",
    address: "Álava, Basque Country, Spain",
    locationPrecision: "approximate",
    contact: {
      other: "via paraisointerespecie.com",
    },
    tags: ["vegan", "sanctuary", "alava", "basque_country", "farm_animal", "rescue"],
    source: "research",
    sourceUrl: "https://paraisointerespecie.com",
  },
  {
    id: "roke-enea-microsantuario",
    name: "Roke Enea Microsantuario",
    lat: 43.3230,
    lng: -3.1243,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue", "multispecies"],
    description:
      "Antiespecista refuge in Muskiz, Bizkaia. A multispecies home where animals of seven species — pigs, sheep, goats, dogs, cats and more — live together, all rescued from violence, abandonment and exploitation. Promotes veganism and animal liberation.",
    address: "Muskiz, Bizkaia, Basque Country, Spain",
    locationPrecision: "exact",
    contact: {
      instagram: "https://www.instagram.com/rokeeneamicrosantuario",
      facebook: "https://www.facebook.com/rokeeneamicrosantuario",
      other: "via Teaming (€1/month)",
    },
    tags: ["vegan", "sanctuary", "bizkaia", "basque_country", "farm_animal", "rescue"],
    source: "research",
    sourceUrl: "https://www.instagram.com/rokeeneamicrosantuario/",
  },

  // ============================================================
  // SPAIN — LA RIOJA
  // ============================================================
  {
    id: "movimiento-antiespecista-lleo",
    name: "Movimiento Antiespecista Lleó",
    lat: 42.4661,
    lng: -2.4397,
    type: "project",
    subtypes: ["association", "rescue"],
    description:
      "Non-profit antiespecista association based in La Rioja (with roots in Álava). Runs El Txoko Lleó, a small home where 20 rescued animals live — dogs, cats and tortoises. Promotes veganism through education, campaigns and the vegan 'EmVutido Lleó'.",
    website: "https://movimientoantiespecistalleo.com",
    address: "La Rioja, Spain",
    locationPrecision: "approximate",
    contact: {
      email: "movimientoantiespecistalleo@gmail.com",
      other: "Teaming · PayPal paypal.me/MovimientoLleo · IBAN ES89 2100 6502 4402 0007 2652",
    },
    tags: ["vegan", "antiespecista", "la-rioja", "association", "rescue"],
    source: "research",
    sourceUrl: "https://movimientoantiespecistalleo.com",
  },
  {
    id: "el-molino-del-corregidor",
    name: "El Molino del Corregidor",
    lat: 42.2320,
    lng: -2.4737,
    type: "accommodation",
    subtypes: ["vegan_hotel", "rural"],
    description:
      "100% vegan rural accommodation in a restored 400-year-old flour mill on the edge of San Román de Cameros, La Rioja. Vegan breakfasts and dinners, cruelty-free products throughout, and guided routes through the Cameros valleys. A reference for vegan tourism in Spain.",
    website: "https://molinodelcorregidor.com",
    address: "Carretera de Piqueras km 36, San Román de Cameros, La Rioja, Spain",
    locationPrecision: "approximate",
    contact: {
      email: "info@molinodelcorregidor.com",
      phone: "+34 669 25 22 45",
      facebook: "https://www.facebook.com/molinodelcorregidor",
    },
    tags: ["vegan", "accommodation", "la-rioja", "vegan_hotel"],
    source: "research",
    sourceUrl: "https://molinodelcorregidor.com",
  },

  // ============================================================
  // SPAIN — CANARY ISLANDS
  // ============================================================
  {
    id: "refugio-the-animal-academy",
    name: "Refugio The Animal Academy",
    lat: 28.3589,
    lng: -14.0540,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue"],
    description:
      "Farm animal refuge on Fuerteventura rescuing animals from abuse and abandonment on the island. Nonprofit with 6.5K Facebook followers. Runs educational activities and welcomes volunteers.",
    website: "https://theanimalacademy.org",
    address: "Fuerteventura, Canary Islands, Spain",
    locationPrecision: "approximate",
    contact: {
      email: "info@theanimalacademy.org",
      facebook: "https://www.facebook.com/theanimalacademy.refugio",
    },
    tags: ["vegan", "sanctuary", "canary_islands", "fuerteventura", "farm_animal", "rescue"],
    source: "social",
    sourceUrl: "https://www.facebook.com/theanimalacademy.refugio",
  },
  {
    id: "finca-arkadia",
    name: "Finca Arkadia Santuario Animal",
    lat: 28.3899,
    lng: -16.5236,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue", "permaculture"],
    description:
      "Antiespecista animal sanctuary and permaculture project in northern Tenerife (La Orotava). A multispecies home for animals rescued from exploitation, abandonment and abuse, with special care for hens. Entirely crowdfunded — no subsidies.",
    website: "https://arkadia-animalsanctuary.org",
    address: "La Orotava, Tenerife, Canary Islands, Spain",
    locationPrecision: "approximate",
    contact: {
      email: "finca.arkadia@gmail.com",
      facebook: "https://www.facebook.com/fincaarkadia",
      other: "via Teaming (€1/month)",
    },
    tags: ["vegan", "sanctuary", "canary_islands", "tenerife", "farm_animal", "rescue", "permaculture"],
    source: "research",
    sourceUrl: "https://www.facebook.com/fincaarkadia",
  },
  {
    id: "tenerife-animal-sanctuary",
    name: "Tenerife Animal Sanctuary",
    lat: 28.1218,
    lng: -16.4625,
    type: "sanctuary",
    subtypes: ["farm_animal", "equine", "rescue"],
    description:
      "Non-profit, eco-sustainable animal rescue centre in Arico, Tenerife — 500+ abandoned animals rescued from the island, starting with horses (formerly Tenerife Horse Rescue). 37K Facebook followers. Registered charity with volunteering and sponsorship.",
    website: "https://tenerifeanimalsanctuary.org",
    address: "La Jaca, Arico, Tenerife, Canary Islands, Spain",
    locationPrecision: "approximate",
    contact: {
      phone: "+34 644 126 126",
      facebook: "https://www.facebook.com/tenerifeanimalsanctuary",
      instagram: "https://www.instagram.com/tenerifeanimalsanctuary",
    },
    tags: ["vegan", "sanctuary", "canary_islands", "tenerife", "farm_animal", "equine", "rescue"],
    source: "research",
    sourceUrl: "https://tenerifeanimalsanctuary.org",
  },
  {
    id: "santuario-petricor",
    name: "Santuario Animal Petricor",
    lat: 28.2936,
    lng: -16.6214,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue"],
    description:
      "Recently created sanctuary project in Tenerife for animals who are victims of human action — mistreatment, exploitation and abandonment. Started three years ago with 2 ducks, now home to 12 plus other rescues. Location kept private.",
    address: "Tenerife, Canary Islands, Spain",
    locationPrecision: "approximate",
    contact: {
      email: "santuariopetricor@gmail.com",
      instagram: "https://www.instagram.com/santuariopetricor",
      other: "via Teaming (€1/month)",
    },
    tags: ["vegan", "sanctuary", "canary_islands", "tenerife", "farm_animal", "rescue"],
    source: "social",
    sourceUrl: "https://www.instagram.com/santuariopetricor",
  },

  // ============================================================
  // PORTUGAL — NORTE & CENTRO
  // ============================================================
  {
    id: "quinta-das-aguias",
    name: "Quinta das Águias",
    lat: 41.9134,
    lng: -8.5640,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue", "project"],
    description:
      "Vegan-run animal sanctuary and sustainability project on 5 hectares in Paredes de Coura, near the Galicia border. Home to 158+ rescued animals — pigs, goats, sheep, chickens, ducks, horses and donkeys. Founded in 2004. Runs organic farming, seed-saving and vegan education. Hosts the annual CouraVeg congress.",
    website: "https://quintadasaguias.org",
    address: "Paredes de Coura, Viana do Castelo, Norte, Portugal",
    locationPrecision: "exact",
    contact: {
      other: "via quintadasaguias.org",
    },
    tags: ["vegan", "rescue", "farm_animal", "volunteer", "norte", "portugal"],
    source: "research",
    sourceUrl: "https://quintadasaguias.org",
  },
  {
    id: "star-mountain-sanctuary",
    name: "Star Mountain Animal Sanctuary",
    lat: 40.5191,
    lng: -7.5334,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue"],
    description:
      "Vegan animal sanctuary founded in 2022 on 5 hectares in Serra da Estrela Natural Park. Cage-free haven for abused and neglected animals — dogs, cats, horses, and farm animals. Follows the 5 Freedoms. Works with local shelters and promotes sterilisation programmes.",
    website: "https://starmountainanimalsanctuary.org",
    address: "Melo, Gouveia, Guarda, Centro, Portugal",
    locationPrecision: "exact",
    contact: {
      other: "via starmountainanimalsanctuary.org",
    },
    tags: ["vegan", "rescue", "farm_animal", "volunteer", "centro", "portugal", "serra-da-estrela"],
    source: "research",
    sourceUrl: "https://starmountainanimalsanctuary.org",
  },
  {
    id: "star-mountain-retreat",
    name: "Star Mountain Vegan Retreat",
    lat: 40.5191,
    lng: -7.5334,
    type: "accommodation",
    subtypes: ["vegan_hotel", "retreat", "wellness"],
    description:
      "Vegan retreat centre adjacent to Star Mountain Animal Sanctuary in Melo, Serra da Estrela. Offers vegan cuisine, yoga, meditation, Reiki and juice fasts in a 7-bedroom house. Part of the sanctuary's mission — tourism income directly funds animal rescue operations.",
    website: "https://veganretreatportugal.com",
    address: "Melo, Gouveia, Guarda, Centro, Portugal",
    locationPrecision: "exact",
    contact: {
      other: "via veganretreatportugal.com",
    },
    tags: ["vegan", "accommodation", "retreat", "centro", "portugal", "serra-da-estrela"],
    source: "research",
    sourceUrl: "https://veganretreatportugal.com",
  },

  // ============================================================
  // PORTUGAL — ALGARVE
  // ============================================================
  {
    id: "outro-lado",
    name: "Outro Lado",
    lat: 37.0174,
    lng: -7.9354,
    type: "project",
    subtypes: ["vegan_restaurant", "project"],
    description:
      "Fully vegan organic restaurant and shop in central Faro, Algarve. Uses 90% local Algarve ingredients, zero plastic. Also runs workshops and yoga. The activist team behind Outro Lado also operates an associated sanctuary for rescued farm animals.",
    website: "https://www.facebook.com/outrolado.pt",
    address: "Rua do Prior 44, Faro, Algarve, Portugal",
    locationPrecision: "exact",
    contact: {
      facebook: "https://www.facebook.com/outrolado.pt",
    },
    tags: ["vegan", "restaurant", "organic", "algarve", "portugal"],
    source: "research",
    sourceUrl: "https://www.facebook.com/outrolado.pt",
  },

  {
    id: "animais-sem-fronteiras",
    name: "Animais Sem Fronteiras",
    lat: 38.7553,
    lng: -8.9608,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue", "dog_hotel"],
    description:
      "Animal sanctuary and rescue centre in Alcochete, Setúbal district. Dedicated to sheltering farm animals and companion animals (dogs, pigs, cows, horses, rabbits, chickens, turkeys, goats, sheep). Very active on Instagram (12.9K followers) with public sanctuary visits and volunteer recruitment. Donations via IBAN.",
    website: "https://www.animaisemfronteiras.org",
    address: "Alcochete, Setúbal, Portugal",
    locationPrecision: "approximate",
    contact: {
      email: "animaisemfronteiras@gmail.com",
      instagram: "https://www.instagram.com/animais_sem_fronteiras/",
      other: "IBAN PT50 0010 0000 5806 2660 0019 0",
    },
    tags: ["vegan", "sanctuary", "setubal", "alentejo", "portugal", "farm_animal", "rescue"],
    source: "social",
    sourceUrl: "https://www.instagram.com/animais_sem_fronteiras/",
  },

  // ============================================================
  // PORTUGAL — LISBON & SETÚBAL
  // ============================================================
  {
    id: "save-and-care",
    name: "Animal Save & Care Portugal",
    lat: 38.5696,
    lng: -8.9012,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue"],
    description:
      "Multi-species sanctuary in Palmela, Setúbal, fighting for animal liberation in Portugal — more than 200 animals rescued from exploitation and slaughter live safely in the sanctuary. Very active on Facebook (300K+ followers) and Instagram.",
    website: "https://www.animalsaveandcareportugal.com",
    address: "Palmela, Setúbal, Portugal",
    locationPrecision: "approximate",
    contact: {
      phone: "+351 935 403 296",
      facebook: "https://www.facebook.com/animalsaveandcareportugal",
      other: "via MBWay · NIB",
    },
    tags: ["vegan", "sanctuary", "setubal", "portugal", "farm_animal", "rescue"],
    source: "research",
    sourceUrl: "https://www.animalsaveandcareportugal.com",
  },

  // ============================================================
  // PORTUGAL — ALENTEJO
  // ============================================================
  {
    id: "monte-dos-vagabundos",
    name: "Monte dos Vagabundos — Santuário Animal",
    lat: 37.5115,
    lng: -8.7072,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue"],
    description:
      "Registered association and run-free sanctuary near São Teotónio, Odemira, for dogs and pigs in desperate need of tender-love-care — focusing on older, traumatised or handicapped animals no one adopts. No website; a caravan rental on the land helps fund the rescue.",
    address: "São Teotónio, Odemira, Alentejo, Portugal",
    locationPrecision: "approximate",
    contact: {
      phone: "+351 926 970 114",
      facebook: "https://www.facebook.com/MontedosVagabundos",
      other: "via PayPal · IBAN · caravan stay",
    },
    tags: ["vegan", "sanctuary", "alentejo", "odemira", "portugal", "farm_animal", "rescue"],
    source: "social",
    sourceUrl: "https://www.facebook.com/MontedosVagabundos",
  },
  {
    id: "pangea-elephant-sanctuary",
    name: "Pangea Elephant Sanctuary",
    lat: 38.7774,
    lng: -7.4167,
    type: "sanctuary",
    subtypes: ["wildlife", "elephants", "rescue"],
    description:
      "Europe's first large-scale elephant sanctuary: 402 hectares between Vila Viçosa and Alandroal, Évora. Gives retired zoo and circus elephants a natural life — Julie, Portugal's last circus elephant, arrived in July 2026. Operated by Pangea Trust (UK) with Born Free and World Animal Protection among its founding members.",
    website: "https://www.pangeatrust.org",
    address: "Between Vila Viçosa and Alandroal, Évora, Alentejo, Portugal",
    locationPrecision: "approximate",
    contact: {
      email: "info@pangeatrust.org",
      other: "via pangeatrust.org (closed to visitors)",
    },
    tags: ["vegan", "sanctuary", "alentejo", "evora", "portugal", "elephants", "wildlife"],
    source: "research",
    sourceUrl: "https://www.pangeatrust.org",
  },

  // ============================================================
  // PORTUGAL — AZORES
  // ============================================================
  {
    id: "donkeys-and-friends",
    name: "Donkeys & Friends",
    lat: 37.7205,
    lng: -25.4560,
    type: "sanctuary",
    subtypes: ["donkey", "rescue"],
    description:
      "Grassroots donkey rescue, rehabilitation and re-homing initiative in the hills of Água de Alto, Vila Franca do Campo, São Miguel — helping conserve and repopulate the Azorean donkey. Run by Luís 'Vidinha' and zoologist Bethany Joy. Offers guided donkey walks.",
    website: "https://www.donkeysandfriends.com",
    address: "Água de Alto, Vila Franca do Campo, São Miguel, Azores, Portugal",
    locationPrecision: "approximate",
    contact: {
      email: "Friendofthedonkey@gmail.com",
      phone: "+351 926 724 810",
      facebook: "https://www.facebook.com/Friendsofthedonkeys",
    },
    tags: ["vegan", "sanctuary", "azores", "sao-miguel", "donkey", "rescue"],
    source: "research",
    sourceUrl: "https://www.donkeysandfriends.com/about/",
  },

  // ============================================================
  // TAIWAN — NORTH
  // ============================================================
  {
    id: "pigs-heaven",
    name: "Pigs' Heaven (豬豬天堂)",
    lat: 25.0657,
    lng: 121.3529,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue"],
    description:
      "A former pig farm converted into a vegan-run farm animal sanctuary in Linkou, New Taipei City. Rescued hundreds of pigs, cows, goats, sheep, chickens, ducks and geese from slaughter. All animals fed a vegan diet. Also operates as a life-education centre hosting school groups and visitors.",
    website: "https://www.facebook.com/豬天堂有機護生農場-140823883307481",
    address: "Linkou District, New Taipei City 244, Taiwan",
    locationPrecision: "approximate",
    contact: {
      facebook: "https://www.facebook.com/豬天堂有機護生農場-140823883307481",
    },
    tags: ["vegan", "taiwan", "new_taipei", "farm_animal", "rescue"],
    source: "research",
    sourceUrl: "https://www.facebook.com/豬天堂有機護生農場-140823883307481",
  },

  // ============================================================
  // TAIWAN — EAST COAST (HUALIEN & TAITUNG)
  // ============================================================
  {
    id: "sun-clover-ecovillage",
    name: "Sun Clover Ecovillage (陽光三葉草生態村)",
    lat: 23.2011,
    lng: 121.2780,
    type: "project",
    subtypes: ["ecovillage", "permaculture"],
    description:
      "Taiwan's first ecovillage recognised by the Global Ecovillage Network, in Fuli Township, Hualien. A regenerative community focused on organic farming, natural building, and ecological education.",
    website: "https://www.sunclover-ecovillage.com",
    address: "Luoshan Village, Fuli Township, Hualien County, Taiwan",
    locationPrecision: "exact",
    contact: {
      other: "via sunclover-ecovillage.com",
    },
    tags: ["vegan", "taiwan", "hualien", "ecovillage", "permaculture", "organic"],
    source: "research",
    sourceUrl: "https://www.sunclover-ecovillage.com",
  },

  // ============================================================
  // TAIWAN — SOUTH (TAINAN)
  // ============================================================
  {
    id: "ananda-suruci",
    name: "Ánanda Suruci Master Unit (阿南達瑪迦玉井生態村)",
    lat: 23.1222,
    lng: 120.4574,
    type: "project",
    subtypes: ["eco_village", "retreat", "permaculture"],
    description:
      "Spiritual eco-village in the Yujing countryside of Tainan. Offers organic permaculture farming, yoga and meditation retreats, and detox programmes. Grows its own organic produce and serves sattvic plant-based meals.",
    website: "https://anandasuruci.org",
    address: "Yujing District, Tainan City, Taiwan",
    locationPrecision: "exact",
    contact: {
      other: "via anandasuruci.org",
    },
    tags: ["vegan", "taiwan", "tainan", "eco_village", "retreat", "permaculture", "yoga"],
    source: "research",
    sourceUrl: "https://anandasuruci.org",
  },
  {
    id: "tainan-guanyin-life-protection",
    name: "Tainan Guanyin's Home Life Protection Garden (臺南市觀音的家護生園區)",
    lat: 22.9921,
    lng: 120.1852,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue", "buddhist_life_protection"],
    description:
      "Buddhist pure-vegetarian life protection organisation operating 15 sanctuary sites across Tainan City. Rescues cows, pigs, goats, sheep, deer, ostriches, chickens, ducks and geese from slaughter. All animals fed a pure vegetarian diet with lifelong care.",
    website: "https://www.avalokitesvara.tw",
    address: "Tainan City, Taiwan",
    locationPrecision: "approximate",
    contact: {
      other: "via avalokitesvara.tw",
    },
    tags: ["vegan", "taiwan", "tainan", "farm_animal", "rescue", "buddhist"],
    source: "research",
    sourceUrl: "https://www.avalokitesvara.tw",
  },
];
