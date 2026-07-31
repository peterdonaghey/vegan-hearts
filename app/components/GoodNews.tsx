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
  // ── School meals ──
  {
    id: "poland-mandatory-vegan-school-lunches",
    title: "Poland Makes Vegan School Lunches Mandatory",
    summary: "Poland's health ministry has signed a regulation requiring every school to serve at least one fully vegan lunch a week, plus plant-based alternatives on days when meat or fish is served. From September 2026, the new rules — based on the Planetary Health Diet — will transform meals for 6.8 million children across nearly 36,000 schools.",
    sourceUrl: "https://www.greenqueen.com.hk/poland-plant-based-meals-vegan-school-lunches-health/",
    sourceName: "Green Queen",
    imageUrl: "https://www.greenqueen.com.hk/wp-content/uploads/2026/02/poland-plant-based-meals-vegan-school-lunches-health-social-1024x536.png",
    date: "February 2026",
    category: "School Meals",
  },

  // ── Vegan movement ──
  {
    id: "veganuary-30-million-2026",
    title: "Record 30 Million People Tried Vegan During Veganuary 2026",
    summary: "A record-breaking 30 million people worldwide chose to try vegan this January, powering at least 1,187 new plant-based products and menu items — a powerful answer to claims that veganism is fading. Interest was so strong in Germany that supermarkets briefly ran out of tofu.",
    sourceUrl: "https://veganuary.com/veganuary-2026-campaign-review/",
    sourceName: "Veganuary",
    imageUrl: "https://veganuary.com/wp-content/uploads/2026/03/Veganuary-2026-Campaign-Review-Blog-Header.png",
    date: "March 2026",
    category: "Vegan Movement",
  },

  // ── Anti-cruelty law ──
  {
    id: "ontario-bans-dog-cat-experiments",
    title: "Ontario Bans Cruel Dog & Cat Experiments",
    summary: "Ontario has become the first jurisdiction in the world to ban invasive medical experiments on cats and dogs. The historic Bill 75 follows shocking revelations about secret dog testing in Ontario labs — a major victory for animal protection in Canada.",
    sourceUrl: "https://animaljustice.ca/blog/victory-ontario-bans-cruel-cat-dog-experiments",
    sourceName: "Animal Justice",
    imageUrl: "https://animaljustice.ca/wp-content/uploads/2026/05/Ontario-band-cat-and-dog-experiments-social.jpg",
    date: "May 2026",
    category: "Policy Win",
  },

  // ── School meals ──
  {
    id: "plant-powered-school-meals-act",
    title: "US Congress to Consider $12 Million Plan for Plant-Based School Lunches",
    summary: "The Plant Powered School Meals Pilot Act would provide $12 million in grants to help American schools serve more plant-based meals — funding culinary training for kitchen staff, plant-based ingredients and dairy-free milk. With nearly 70% of Americans backing better vegan options in schools, momentum is growing on Capitol Hill.",
    sourceUrl: "https://vegnews.com/congress-vegan-school-meals",
    sourceName: "VegNews",
    imageUrl: "https://vegnews.com/media/W1siZiIsIjU2OTk1L1JCIGFydGljbGUgaW1hZ2VzLTE5LnBuZyJdLFsicCIsImNyb3BfcmVzaXplZCIsIjE2MDB4ODQwKzArNTIiLCIxMjAweDYzMF4iXSxbInAiLCJlbmNvZGUiLCJqcGciLCIiXSxbInAiLCJvcHRpbWl6ZSJdLFsicCIsInNyZ2Jfc3RyaXAiXV0/RB%20article%20images-19.jpg?sha=b232f7a13684fd87",
    date: "March 2026",
    category: "School Meals",
  },

  // ── Vegan movement ──
  {
    id: "vegan-society-top-countries",
    title: "These Are the Top Countries for Plant-Based Eating, According to The Vegan Society",
    summary: "The Vegan Society's first global investigation into plant-based eating finds veganism is no longer a niche movement: 16-30% of people are flexitarian in most countries, India leads with 14% vegan and 26% vegetarian, and Taiwan and Portugal top the per-capita ranking for vegan restaurants.",
    sourceUrl: "https://www.greenqueen.com.hk/veganism-around-the-world-the-vegan-society-report-friendly-countries/",
    sourceName: "Green Queen",
    imageUrl: "https://www.greenqueen.com.hk/wp-content/uploads/2026/01/veganism-around-the-world-the-vegan-society-report-friendly-countries-social-1024x536.png",
    date: "January 2026",
    category: "Vegan Movement",
  },

  // ── Big victory ──
  {
    id: "octopus-farm-plans-withdrawn",
    title: "Plans for the World's First Octopus Farm Scrapped",
    summary: "Nueva Pescanova has withdrawn plans for the world's first commercial octopus farm in Gran Canaria, Spain — where one million highly intelligent octopuses a year would have been raised in crowded tanks. After three years of campaigning by scientists and animal welfare groups, a cruel new industry has been prevented from taking hold in Europe.",
    sourceUrl: "https://www.eurogroupforanimals.org/news/landmark-victory-plans-worlds-first-octopus-farm-withdrawn",
    sourceName: "Eurogroup for Animals",
    imageUrl: "https://www.eurogroupforanimals.org/files/eurogroupforanimals/styles/blog_detail/public/2026-07/Octopus%20-%20canva_0.png?itok=4qtP7DVS",
    date: "July 2026",
    category: "Policy Win",
  },

  // ── School meals ──
  {
    id: "spain-plant-based-school-meals-law",
    title: "Spain Makes Plant-Based School Meals a Legal Right",
    summary: "New legislation in Spain requires every school to offer fully plant-based meals — or provide facilities for students to bring and store their own food if it can't. The Royal Decree also mandates weekly legumes and daily fruit and vegetables while banning sugary drinks, a landmark win for vegan families across the country.",
    sourceUrl: "https://www.veganfoodandliving.com/news/plant-based-school-meals-spain-new-law/",
    sourceName: "Vegan Food & Living",
    imageUrl: "https://www.veganfoodandliving.com/wp-content/uploads/2025/05/vegan-lunch-box-near-thermos-fresh-apples-and-biscuits-in-front-of-school-backpack-768x510.jpg",
    date: "May 2025",
    category: "School Meals",
  },

  // ── Anti-cruelty policy ──
  {
    id: "us-military-ends-live-animal-training",
    title: "US Military Ends Practice of Shooting Live Animals to Train Medics",
    summary: "The US military has ended the decades-old practice of shooting live animals to train medics to treat battlefield wounds, following years of bipartisan pressure from animal welfare advocates. It's a landmark policy change sparing thousands of animals from being used in trauma training.",
    sourceUrl: "https://www.smithsonianmag.com/smart-news/us-military-ends-practice-of-shooting-live-animals-to-train-medics-to-treat-battlefield-wounds-180987942/",
    sourceName: "Smithsonian Magazine",
    imageUrl: "https://th-thumbnailer.cdn-si-edu.com/WIyFksWexaNP1mNgSCQkf8SVd0M=/fit-in/1600x0/filters:focal(3000x2000:3001x2001)/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer_public/cf/0b/cf0b0b7a-e9f8-4637-a5c5-afbf9d19bbab/pexels-pavel-bondarenko-1393453-2722455.jpg",
    date: "January 2026",
    category: "Policy Win",
  },

  // ── Anti-cruelty law ──
  {
    id: "italy-end-male-chick-culling",
    title: "Italy to End the Killing of Male Chicks in the Egg Industry",
    summary: "Italy has published guidelines that will end the mass culling of day-old male chicks from January 2027, requiring hatcheries to use in-ovo sexing technology instead. The change could save an estimated 34 million chicks a year from being killed on their first day of life.",
    sourceUrl: "https://www.eurogroupforanimals.org/news/italy-end-killing-male-chicks-egg-industry-end-2026",
    sourceName: "Eurogroup for Animals",
    imageUrl: "https://www.eurogroupforanimals.org/files/eurogroupforanimals/styles/blog_detail/public/2020-02/chicks-hatched-recovered-chicken-young-animal.jpg?itok=pPDOqk7c",
    date: "November 2025",
    category: "Policy Win",
  },

  // ── Anti-cruelty law ──
  {
    id: "poland-fur-farming-ban",
    title: "Poland Bans Fur Farming — Europe's Largest Producer",
    summary: "Poland's president has signed a law banning fur farming, ending the country's reign as the EU's largest fur producer and shutting down its mink farms over the coming years. The ban is a huge blow to the global fur trade and is seen as paving the way for an EU-wide prohibition.",
    sourceUrl: "https://notesfrompoland.com/2025/12/02/polish-president-signs-fur-farm-ban-into-law-but-vetoes-prohibition-on-chaining-up-dogs/",
    sourceName: "Notes From Poland",
    imageUrl: "https://notesfrompoland.com/wp-content/uploads/2025/12/54283180338_b834ef4f86_k.jpg",
    date: "December 2025",
    category: "Policy Win",
  },
];
