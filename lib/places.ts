export type PlaceType = "sanctuary" | "restaurant" | "shop" | "project" | "accommodation";

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
  tags: string[];
  image?: string;
  /** Tracks data provenance - manual research, osm, community, etc */
  source: string;
}

/**
 * Vegan Hearts Map — Place Data
 *
 * A manually curated collection of animal sanctuaries and vegan projects worldwide.
 * Initially focused on Spain & Portugal. Growing through research and community submissions.
 *
 * To add a place: just add an object to this array. The map auto-updates.
 * Coordinate format: [lat, lng] — use decimal degrees.
 */
export const places: Place[] = [
  // ============================================================
  // SPAIN — GALICIA
  // ============================================================
  {
    id: "mino-valley",
    name: "Mino Valley Farm Sanctuary",
    lat: 42.5120,
    lng: -7.6370,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue"],
    description:
      "First farm animal sanctuary in Galicia. 50 acres of meadows and woodland in the Ribeira Sacra valley. Home to 230+ rescued animals — cows, pigs, goats, sheep, chickens, ducks, horses, and donkeys. Founded in 2013 by Abigail Geer.",
    website: "https://minovalley.org",
    address: "Pantón, Ribeira Sacra, Lugo, Galicia, Spain",
    tags: ["vegan", "rescue", "volunteer", "farm_animal", "galicia"],
    source: "manual",
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
    tags: ["vegan", "ecovillage", "pet_friendly", "restaurant", "galicia"],
    source: "manual",
  },
  {
    id: "acougo-refugio",
    name: "Acougo Refugio de Animales",
    lat: 43.2500,
    lng: -8.5800,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue"],
    description:
      "Farm animal sanctuary in Montemaior, A Laracha, opened in 2023 by actress Mara Collazo. Home to 70+ rescued animals on 6 hectares — cows, goats, sheep, pigs, horses and donkeys. First farm animal refuge in the Costa da Morte region. Vegan-aligned lifelong care.",
    website: "https://acougo.org",
    address: "Montemaior, A Laracha, A Coruña, Galicia, Spain",
    tags: ["vegan", "rescue", "volunteer", "farm_animal", "galicia"],
    source: "research",
  },
  {
    id: "caserio-castineira",
    name: "Caserío da Castiñeira",
    lat: 42.3122,
    lng: -7.4498,
    type: "accommodation",
    subtypes: ["rural_tourism", "vegan_hotel"],
    description:
      "100% vegan rural tourism house in Montederramo, Ribeira Sacra. An 18th-century Galician farmhouse fully restored with 4 apartments and a double room. Offers organic vegan cuisine, detox programmes, hiking routes, and cooking workshops. Operating since 2008.",
    website: "http://www.turismoruralvegano.com",
    address: "A Castiñeira 1, Montederramo, Ourense, Galicia, Spain",
    tags: ["vegan", "accommodation", "rural_tourism", "organic", "galicia", "ribeira_sacra"],
    source: "research",
  },
  {
    id: "frente-la-santuario",
    name: "Frente L.A. Santuario Animal",
    lat: 43.3000,
    lng: -7.6800,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue"],
    description:
      "Private rescue and recovery centre founded in 2016 in Vilalba by a vegan couple. 6 hectares of forest and pasture. Home to rescued farm animals — pigs, sheep, goats, chickens — plus dogs and cats with mobility issues. Operates through sponsorships and a solidarity store.",
    website: "https://www.frentela.org",
    address: "Vilalba, Lugo, Galicia, Spain",
    tags: ["vegan", "rescue", "volunteer", "farm_animal", "galicia"],
    source: "research",
  },
  {
    id: "o-sono-galicia",
    name: "O Soño Galicia",
    lat: 43.6000,
    lng: -8.1300,
    type: "accommodation",
    subtypes: ["guesthouse", "vegan_hotel"],
    description:
      "Fully vegan guesthouse perched above Valdoviño Bay in A Coruña. 6 rooms for surfers, yogis, and hikers. Offers surfboard rental, daily yoga, and vegan soulfood. Adults-only retreat with ocean views.",
    website: "https://o-sono-galicia.com",
    address: "Valdoviño, A Coruña, Galicia, Spain",
    tags: ["vegan", "accommodation", "surf", "yoga", "guesthouse", "galicia"],
    source: "research",
  },
  {
    id: "santuario-vacaloura",
    name: "Santuario Vacaloura",
    lat: 42.9300,
    lng: -8.1600,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue"],
    description:
      "Antiespecista animal sanctuary in Arzúa. 250+ animals — cows, pigs, goats, sheep, chickens, horses — rescued from exploitation and abandonment. Moved to a new permanent location in Arzúa in 2025. Operates through volunteer support and sponsorships. Promotes veganism.",
    website: "https://santuariovacaloura.org",
    address: "Arzúa, A Coruña, Galicia, Spain",
    tags: ["vegan", "rescue", "volunteer", "farm_animal", "galicia", "antiespecista"],
    source: "research",
  },
  {
    id: "savia-ecoaldea",
    name: "Savia Ecoaldea Vegana",
    lat: 43.4300,
    lng: -7.0400,
    type: "project",
    subtypes: ["ecovillage", "community"],
    description:
      "The first vegan agroecological cohousing project in Spain, in the Valle del Eo on the Galicia-Asturias border. A community built on veganism, permaculture, degrowth, and mutual support. Shared housing, organic vegan gardens, and a commitment to animal liberation. Accepts residents and visitors.",
    website: "https://www.saviaecoaldeavegana.com",
    address: "Valle del Eo, Ribadeo area, Galicia/Asturias border, Spain",
    tags: ["vegan", "ecovillage", "community", "permaculture", "organic", "galicia", "asturias"],
    source: "research",
  },
  {
    id: "sueno-de-jill",
    name: "El Sueño de Jill",
    lat: 42.4300,
    lng: -8.6400,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue"],
    description:
      "Mini multi-species antiespecista sanctuary in Pontevedra run by Paula Cudeiro. Rescues animals from abuse, abandonment and exploitation. Home to 30+ animals — sheep, goats, rabbits, rats, dogs, cats. Actively promotes veganism through rescue and education.",
    address: "Pontevedra, Galicia, Spain",
    tags: ["vegan", "rescue", "antiespecista", "farm_animal", "galicia"],
    source: "research",
  },
  {
    id: "val-de-rodas",
    name: "Val de Rodas Rewilding Project",
    lat: 42.5200,
    lng: -8.3900,
    type: "project",
    subtypes: ["rewilding", "permaculture"],
    description:
      "Rewilding and sustainable living initiative in the Galician mountains run by a non-profit NGO. Restoring a ruined village, removing eucalyptus for native woodland regeneration, growing organic food with a vegan permaculture philosophy. Offers volunteer stays with vegan meals.",
    address: "Near Pontevedra, Galicia, Spain",
    tags: ["vegan", "rewilding", "permaculture", "volunteer", "galicia"],
    source: "research",
  },

  // ============================================================
  // SPAIN — CATALONIA
  // ============================================================
  {
    id: "santuario-gaia",
    name: "Fundación Santuario Gaia",
    lat: 42.3123,
    lng: 2.3702,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue", "foundation"],
    description:
      "One of Spain's largest vegan farm animal sanctuaries. 50+ hectares in the Catalan Pyrenees. Home to 500+ rescued animals — cows, pigs, goats, sheep, chickens, horses, turkeys, and more. Founded in 2012 by Ismael López and Coque Fernández.",
    website: "https://fundacionsantuariogaia.org",
    address: "La Cabanya del Molladar s/n, Camprodon, Girona, Catalonia, Spain",
    tags: ["vegan", "rescue", "volunteer", "farm_animal", "catalonia", "foundation"],
    source: "manual",
  },

  // ============================================================
  // SPAIN — ANDALUSIA
  // ============================================================
  {
    id: "santuario-la-candela",
    name: "Santuario La Candela",
    lat: 37.2675,
    lng: -6.0622,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue", "shelter"],
    description:
      "Vegan animal sanctuary on 60+ hectares near Doñana Natural Park. Rescues and rehabilitates farm animals, dogs, and cats. 400+ residents including cows, pigs, goats, sheep, horses, donkeys. Founded in 2010. Also runs vegan awareness programs.",
    website: "https://santuariolacandela.com",
    address: "La Puebla del Río, Sevilla, Andalusia, Spain",
    tags: ["vegan", "rescue", "farm_animal", "volunteer", "andalusia"],
    source: "manual",
  },
  {
    id: "jacobs-ridge",
    name: "Jacobs Ridge Animal Sanctuary",
    lat: 38.0418,
    lng: -1.4907,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue", "charity"],
    description:
      "Vegan animal sanctuary in the mountains of Murcia. UK-registered charity. Home to 130+ rescued animals — 72 pigs plus cows, goats, sheep, donkeys, horses, and poultry. Focus on rescuing from the agricultural industry.",
    website: "https://jacobsridgeanimalsanctuary.com",
    address: "Near Mula, Murcia, Spain",
    tags: ["vegan", "rescue", "farm_animal", "charity", "murcia"],
    source: "manual",
  },

  // ============================================================
  // SPAIN — BALEARIC ISLANDS
  // ============================================================
  {
    id: "eden-sanctuary",
    name: "Eden Sanctuary Mallorca",
    lat: 39.6953,
    lng: 2.8862,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue"],
    description:
      "Vegan animal sanctuary on Mallorca. Home to 50+ rescued farm animals including pigs, goats, sheep, donkeys, horses, and poultry. Provides forever homes for animals rescued from abuse, neglect, and the agricultural industry.",
    website: "https://edensanctuary.org",
    address: "Mallorca, Balearic Islands, Spain",
    tags: ["vegan", "rescue", "farm_animal", "mallorca", "balearic"],
    source: "manual",
  },

  // ============================================================
  // SPAIN — MADRID
  // ============================================================
  {
    id: "santuario-vegan",
    name: "Fundación Santuario Vegan",
    lat: 40.4060,
    lng: -4.3820,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue", "foundation"],
    description:
      "Vegan farm animal sanctuary founded in 2011 near Madrid. Rescues and rehabilitates cows, sheep, goats, pigs, chickens, horses, and donkeys from the livestock industry. One of Spain's most established vegan sanctuaries. Runs volunteer and education programmes.",
    website: "https://santuariovegan.org",
    address: "San Martín de Valdeiglesias, Madrid, Spain",
    tags: ["vegan", "rescue", "farm_animal", "volunteer", "madrid", "foundation"],
    source: "research",
  },

  // ============================================================
  // SPAIN — ASTURIAS
  // ============================================================
  {
    id: "santuario-corazon-verde",
    name: "Santuario Corazón Verde",
    lat: 43.3458,
    lng: -5.3627,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue"],
    description:
      "Farm animal sanctuary relocated from Navarra to Piloña, Asturias in 2025. Rescues, rehabilitates, and provides permanent homes for cows, pigs, sheep, goats, and other animals exploited by the livestock industry. A vegan antiespecista space promoting respectful coexistence between species.",
    website: "https://www.santuariocorazonverde.org",
    address: "Piloña, Asturias, Spain",
    tags: ["vegan", "sanctuary", "asturias", "farm_animal", "rescue"],
    source: "research",
  },

  // ============================================================
  // SPAIN — CANTABRIA
  // ============================================================
  {
    id: "refugio-manada-cantabra",
    name: "Refugio Animal La Manada Cántabra",
    lat: 43.3996,
    lng: -3.9507,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue"],
    description:
      "Animal sanctuary founded in 2021 in Oruña de Piélagos, Cantabria. Rescues farm animals — cows, horses, goats, donkeys — seized by SEPRONA or abandoned, providing them a dignified home away from slaughter. Home to 50+ animals. Won a World Vegan Day award in 2024.",
    website: "https://www.refugioanimallamanadacanta.org",
    address: "Oruña de Piélagos, Cantabria, Spain",
    tags: ["vegan", "sanctuary", "cantabria", "farm_animal", "rescue"],
    source: "research",
  },

  // ============================================================
  // SPAIN — BASQUE COUNTRY / EUSKADI
  // ============================================================
  {
    id: "burrita-carmela",
    name: "Asociación Burrita Carmela",
    lat: 43.2167,
    lng: -2.7333,
    type: "sanctuary",
    subtypes: ["rescue", "donkey"],
    description:
      "Family-run non-profit founded in 2015 in Amorebieta, Bizkaia. Dedicated to the protection, rescue and care of donkeys. Currently home to 20+ equids. Runs awareness programmes on animal respect and dignified life for all sentient beings.",
    website: "https://www.burritacarmela.com",
    address: "Amorebieta, Bizkaia, Basque Country, Spain",
    tags: ["vegan", "sanctuary", "bizkaia", "basque_country", "donkey", "rescue"],
    source: "research",
  },
  {
    id: "la-vida-color-frambuesa",
    name: "Santuario La Vida Color Frambuesa",
    lat: 42.8060,
    lng: -2.9090,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue", "multispecies"],
    description:
      "Multispecies sanctuary founded in 2017 in Ribera Alta, Álava. Home to 150+ animals of 14 species — horses, donkeys, sheep, goats, pigs, hens, turkeys, ducks and more. Run by a vegan veterinarian. Combines rescue, rehabilitation and vegan awareness.",
    website: "https://lavidacolorframbuesa.org",
    address: "Ribera Alta, Álava, Basque Country, Spain",
    tags: ["vegan", "sanctuary", "alava", "basque_country", "farm_animal", "rescue"],
    source: "research",
  },
  {
    id: "paraiso-interespecie",
    name: "Santuario Paraíso Interespecie",
    lat: 42.8500,
    lng: -2.7500,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue"],
    description:
      "Antiespecista, anarcho-transferminist and libertarian sanctuary founded in 2018 in Álava. Rescues non-human animals from exploitation and abandonment — pigs, hens, pigeons, dogs and cats — offering them a dignified life. Promotes animal rights from an intersectional perspective.",
    website: "https://paraisointerespecie.com",
    address: "Álava, Basque Country, Spain",
    tags: ["vegan", "sanctuary", "alava", "basque_country", "farm_animal", "rescue"],
    source: "research",
  },
  {
    id: "roke-enea-microsantuario",
    name: "Roke Enea Microsantuario",
    lat: 43.3240,
    lng: -3.1180,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue", "multispecies"],
    description:
      "Antiespecista refuge in Muskiz, Bizkaia. A multispecies home where animals of seven species — pigs, sheep, goats, dogs, cats and more — live together, all rescued from violence, abandonment and exploitation. Promotes veganism and animal liberation.",
    address: "Muskiz, Bizkaia, Basque Country, Spain",
    tags: ["vegan", "sanctuary", "bizkaia", "basque_country", "farm_animal", "rescue"],
    source: "research",
  },

  // ============================================================
  // PORTUGAL — NORTE
  // ============================================================
  {
    id: "quinta-das-aguias",
    name: "Quinta das Águias",
    lat: 41.9100,
    lng: -8.5600,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue", "project"],
    description:
      "Vegan-run animal sanctuary and sustainability project on 5 hectares in Paredes de Coura, near the Galicia border. Home to 158+ rescued animals — pigs, goats, sheep, chickens, ducks, horses and donkeys. Founded in 2004. Runs organic farming, seed-saving and vegan education. Hosts the annual CouraVeg congress.",
    website: "https://quintadasaguias.org",
    address: "Paredes de Coura, Viana do Castelo, Norte, Portugal",
    tags: ["vegan", "rescue", "farm_animal", "volunteer", "norte", "portugal"],
    source: "research",
  },

  // ============================================================
  // PORTUGAL — CENTRO (SERRA DA ESTRELA)
  // ============================================================
  {
    id: "star-mountain-sanctuary",
    name: "Star Mountain Animal Sanctuary",
    lat: 40.5217,
    lng: -7.5293,
    type: "sanctuary",
    subtypes: ["farm_animal", "rescue"],
    description:
      "Vegan animal sanctuary founded in 2022 on 5 hectares in Serra da Estrela Natural Park. Cage-free haven for abused and neglected animals — dogs, cats, horses, and farm animals. Follows the 5 Freedoms. Works with local shelters and promotes sterilisation programmes.",
    website: "https://starmountainanimalsanctuary.org",
    address: "Melo, Gouveia, Guarda, Centro, Portugal",
    tags: ["vegan", "rescue", "farm_animal", "volunteer", "centro", "portugal", "serra-da-estrela"],
    source: "research",
  },
  {
    id: "star-mountain-retreat",
    name: "Star Mountain Vegan Retreat",
    lat: 40.5217,
    lng: -7.5293,
    type: "accommodation",
    subtypes: ["vegan_hotel", "retreat", "wellness"],
    description:
      "Vegan retreat centre adjacent to Star Mountain Animal Sanctuary in Melo, Serra da Estrela. Offers vegan cuisine, yoga, meditation, Reiki and juice fasts in a 7-bedroom house. Part of the sanctuary's mission — tourism income directly funds animal rescue operations.",
    website: "https://veganretreatportugal.com",
    address: "Melo, Gouveia, Guarda, Centro, Portugal",
    tags: ["vegan", "accommodation", "retreat", "centro", "portugal", "serra-da-estrela"],
    source: "research",
  },

  // ============================================================
  // PORTUGAL — ALGARVE
  // ============================================================
  {
    id: "outro-lado",
    name: "Outro Lado",
    lat: 37.0196,
    lng: -7.9330,
    type: "restaurant",
    subtypes: ["vegan_restaurant", "project"],
    description:
      "Fully vegan organic restaurant and shop in central Faro, Algarve. Uses 90% local Algarve ingredients, zero plastic. Also runs workshops and yoga. The activist team behind Outro Lado also operates an associated sanctuary for rescued farm animals.",
    website: "https://www.facebook.com/outrolado.pt",
    address: "Rua do Prior 44, Faro, Algarve, Portugal",
    tags: ["vegan", "restaurant", "organic", "algarve", "portugal"],
    source: "research",
  },
];

/**
 * Get all unique tags from the places dataset.
 */
export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  places.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

/**
 * Get all unique types from the places dataset.
 */
export function getAllTypes(): PlaceType[] {
  const typeSet = new Set<PlaceType>();
  places.forEach((p) => typeSet.add(p.type));
  return Array.from(typeSet);
}
