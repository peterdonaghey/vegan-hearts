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
            Good Vegan News
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
    id: 'europe-plant-based-16bn',
    title: "Europe's Plant-Based Market Hits €16.3 Billion",
    summary: "The plant-based food market across six European countries reached €16.3 billion in 2025, growing 5.1% year-on-year. But meat alternatives are only 4% of this — nuts, seeds, and dairy alternatives dominate, driven by flexitarians.",
    sourceUrl: "https://www.foodnavigator.com/Article/2026/04/21/plant-based-meat-only-4-of-plant-based-market/",
    sourceName: "FoodNavigator",
    imageUrl: "https://www.foodnavigator.com/resizer/v2/GTZLOL7BUVBO7FZV75YR24U3DM.jpg?auth=9ad2d6f67a35c9e542c0449880eb515170618e4bf0951678423085658c4b2c94&smart=true",
    date: "April 2026",
    category: "Market Growth"
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