'use client';

import React, { useState } from 'react';

export interface GoodNewsItem {
  id: string;
  title: string;
  summary: string;
  sourceUrl: string;
  sourceName: string;
  imageUrl?: string;
  date: string;
  category: string;
}

interface GoodNewsProps {
  items: GoodNewsItem[];
}

function NewsCard({ item }: { item: GoodNewsItem }) {
  const [imgError, setImgError] = useState(false);

  return (
    <a
      href={item.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-stone-100 hover:border-vh-orange/30 hover:-translate-y-1"
    >
      <div className="relative h-44 overflow-hidden bg-stone-100">
        {!imgError && item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-vh-green/10 to-vh-orange/10">
            <span className="text-4xl">🌱</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-vh-green rounded-full shadow-sm">
            {item.category}
          </span>
        </div>
      </div>
      <div className="p-5">
        <p className="text-xs text-stone-400 mb-2 font-medium tracking-wide uppercase">{item.date}</p>
        <h3 className="text-lg font-display font-semibold text-vh-green mb-2 leading-snug group-hover:text-vh-orange transition-colors duration-300">
          {item.title}
        </h3>
        <p className="text-sm text-stone-600 leading-relaxed mb-4 line-clamp-3">
          {item.summary}
        </p>
        <div className="flex items-center text-xs font-medium text-vh-orange/80 group-hover:text-vh-orange transition-colors">
          <span>Read more on {item.sourceName}</span>
          <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </a>
  );
}

export default function GoodNews({ items }: GoodNewsProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="px-6 py-20 bg-[#FFFAF1]">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-vh-green/10 text-vh-green text-sm font-medium rounded-full mb-4">
            🌻 Uplifting Updates
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-vh-green mb-4">
            Fresh Vegan News
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-vh-orange to-vh-green rounded-full mx-auto mb-5"></div>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            A warm bulletin board of hope from around the world — real stories of compassion, progress, and plant-powered joy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {items.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>

        <div className="mt-14 text-center">
          <p className="text-sm text-stone-400 italic">
            Stories gathered from trusted sources across Europe and beyond. Links open in a new tab.
          </p>
        </div>
      </div>
    </section>
  );
}

export const defaultGoodNews: GoodNewsItem[] = [
  // ── July 2026 ──
  {
    id: "beluga-whales-rescued-marineland",
    title: "4 Beluga Whales from Shuttered Canadian Park Arrive at Chicago's Shedd Aquarium After Rescue",
    summary: "Four beluga whales were successfully rescued from the closed Marineland theme park in Ontario and transported to Chicago's Shedd Aquarium, with touching photos showing the complex operation that gave these gentle giants a new lease on life.",
    sourceUrl: "https://www.goodnewsnetwork.org/4-beluga-whales-from-shuttered-canadian-park-arrive-at-chicagos-shedd-aquarium-after-rescue-look/",
    sourceName: "Good News Network",
    imageUrl: "https://www.goodnewsnetwork.org/wp-content/uploads/2026/07/The-translocation-operation-credit-Tidebreakers-via-SWNS.jpg",
    date: "July 2026",
    category: "Sanctuary",
  },

  // ── June 2026 ──
  {
    id: "fandango-sanctuary-florida",
    title: "I Found a Florida Sanctuary Where Rescued Farm Animals Finally Get to Rest",
    summary: "A visit to Fandango Sanctuary in Englewood, Florida reveals the incredible stories of rescued farm animals who, after surviving neglect and abuse, have found a peaceful forever home filled with compassion and dignity — a beautiful reminder of the transformative power of animal sanctuaries.",
    sourceUrl: "https://uncoveringflorida.com/i-found-a-florida-sanctuary-where-rescued-farm-animals-finally-get-to-rest/",
    sourceName: "Uncovering Florida",
    imageUrl: "https://uncoveringflorida.com/wp-content/uploads/2026/05/i-found-a-florida-sanctuary-where-rescued-farm-animals-finally-get-to-rest.jpg",
    date: "June 2026",
    category: "Sanctuary",
  },

  // ── May 2026 ──
  {
    id: "farm-sanctuary-40-years",
    title: "Farm Sanctuary marks 40 years of animal rescue and advocacy",
    summary: "What began with the rescue of a single sheep has grown into a worldwide movement — Farm Sanctuary, the pioneering farm animal protection organization, celebrates 40 years of rescuing abused farm animals, advocating for compassion, and inspiring a plant-based future.",
    sourceUrl: "https://www.witf.org/2026/05/12/farm-sanctuary-marks-40-years-of-animal-rescue-and-advocacy/",
    sourceName: "WITF / The Spark",
    imageUrl: "https://www.witf.io/wp-content/uploads/2026/05/gene-hilda-1358x1080.jpeg",
    date: "May 2026",
    category: "Sanctuary",
  },

  // ── May 2026 ──
  {
    id: "omi-now-loved-by-friends",
    title: "Once Abused and Left Behind, Omi's Now Loved By So Many Friends",
    summary: "Omi was just a helpless calf when he was cruelly abandoned alone on the side of a road — but today he's thriving at Farm Sanctuary, surrounded by animal friends and loving caregivers in a heartwarming story of resilience and the healing power of compassion.",
    sourceUrl: "https://www.farmsanctuary.org/news-stories/once-abused-omi-now-loved-by-friends",
    sourceName: "Farm Sanctuary",
    imageUrl: "https://assets.farmsanctuary.org/content/uploads/2026/05/14121804/2026_05-07_FSAC_Omi_cow_CD-9565-scaled.jpg",
    date: "May 2026",
    category: "Sanctuary",
  },

  // ── June 2026 ──
  {
    id: "new-roots-le-gratine-lupine-cheese",
    title: "Swiss Vegan Creamery New Roots Launches Lupine-Based Grated Cheese Alternative",
    summary: "Swiss creamery New Roots has launched Le Gratiné, a meltable, stretchy grated cheese alternative made from locally sourced organic lupine beans — a regional protein source that also enriches soil health. The company helped cultivate 90 tons of lupins in 2025, and sweet lupin was just named Superfood of the Year 2026 by Biovision.",
    sourceUrl: "https://vegconomist.com/cheese-alternatives/swiss-vegan-creamery-new-root-launches-lupine-based-grated-cheese-alternative/",
    sourceName: "vegconomist",
    imageUrl: "https://assets.vegconom.de/media/wp-content/uploads/sites/3/2026/06/02165029/Artikel-Header-1200-x-900-px-19-1.jpg",
    date: "June 2026",
    category: "Innovation",
  },

  {
    id: 'amsterdam-ads-ban',
    title: "Amsterdam Bans Meat & Fossil Fuel Ads",
    summary: "In a world-first for a capital city, Amsterdam has banned public advertisements for meat and fossil fuels from billboards and transit spaces, aligning urban advertising with climate goals.",
    sourceUrl: "https://www.cbsnews.com/news/amsterdam-bans-advertising-meat-fossil-fuels-public-places/",
    sourceName: "CBS News",
    imageUrl: "https://assets3.cbsnewsstatic.com/hub/i/r/2026/05/05/17425e29-6118-4a88-88b5-dd08454e5cac/thumbnail/1200x630/0a0d56c3705b8b97b651e675b59d9b58/gettyimages-2269163881.jpg",
    date: "May 2026",
    category: "Policy Win"
  },
  {
    id: 'plant-based-cheaper-uk',
    title: "Plant-Based Meat Now 33% Cheaper in UK Shops",
    summary: "New data shows it's now significantly cheaper to choose plant-based meat over animal equivalents in major supermarkets like Tesco, as meat prices soar and the 'vegan tax' disappears.",
    sourceUrl: "https://veganfoodandliving.com/news/plant-based-prices-cheaper-beef/",
    sourceName: "Vegan Food & Living",
    imageUrl: "https://www.veganfoodandliving.com/wp-content/uploads/2026/05/Shopper-hand-holding-a-Package-of-Beyond-Meat-brand-Plant-Based-hamburger-beyond-ground-beef-substitute-in-a-supermarket-freezer-shelf.jpg",
    date: "May 2026",
    category: "Price Win"
  },
  {
    id: 'billie-hen-rescue',
    title: "Hen Rescued From Slaughter Finds Joy at Sanctuary",
    summary: "Billie the hen was minutes from death when activists spoke with her transport driver — and one compassionate conversation changed everything. Now at Farm Sanctuary, she dances to music and is serenaded by her caregivers, proving that connection between unlikely allies can save a life.",
    sourceUrl: "https://www.farmsanctuary.org/news-stories/four-farm-animals-rescued-just-in-time",
    sourceName: "Farm Sanctuary",
    imageUrl: "https://assets.farmsanctuary.org/content/uploads/2026/05/06095237/2026_02-06_FSAC_BillieEilish_hen_CD-5507-1600x1067.jpg",
    date: "May 2026",
    category: "Sanctuary"
  },
  {
    id: 'global-sanctuary-day',
    title: "First Global Sanctuary Day Celebrated",
    summary: "Forty years after Farm Sanctuary's founding, animal advocates worldwide celebrated the first-ever Global Sanctuary Day, honouring the rescue and care of farmed animals across hundreds of sanctuaries.",
    sourceUrl: "https://www.npr.org/2026/04/17/nx-s1-5775921/animal-activists-are-celebrating-their-first-global-sanctuary-day",
    sourceName: "NPR",
    imageUrl: "https://assets.farmsanctuary.org/content/uploads/2026/03/10093855/2024_05-20_FSNY_Mustard_hat_and_Eat_Plants_long_sleeve_with_Ayla_and_Hayes_steer_LH_6610-1-1600x1065.jpg",
    date: "April 2026",
    category: "Sanctuary"
  },
  {
    id: 'finland-dietary-guidelines',
    title: "Finland's New Guidelines Boost Plant-Based Eating",
    summary: "Finland's updated national dietary guidelines are driving a surge in whole-food proteins like tofu and legumes, with meat reduction now the most popular dietary change among Finns.",
    sourceUrl: "https://greenqueen.com.hk/finland-food-based-dietary-guidelines-plant-based-market-growth",
    sourceName: "Green Queen",
    imageUrl: "https://www.greenqueen.com.hk/wp-content/uploads/2026/04/finland-food-based-dietary-guidelines-plant-based-market-growth-social-1024x536.png",
    date: "April 2026",
    category: "Health Policy"
  },
  {
    id: 'eu-plant-based-eggs',
    title: "EU Plant-Based Eggs Market to Hit $211M by 2036",
    summary: "Driven by food-tech innovation and rising vegan adoption, the EU plant-based eggs market is forecast to grow at 17.5% annually, reaching over $200 million within a decade.",
    sourceUrl: "https://www.morningstar.com/news/accesswire/1157381msn/eu-plant-based-eggs-market-outlook-2026-2036-vegan-adoption-and-food-tech-innovation-drive-usd-211-million-opportunity",
    sourceName: "Morningstar",
    imageUrl: "https://app.accessnewswire.com/imagelibrary/8971f4da-a587-4c4c-93b4-d636b976ceb3/image.png",
    date: "April 2026",
    category: "Innovation"
  }
];
