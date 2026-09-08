import { SupportedLanguage } from '../types';

export interface Translations {
  appName: string;
  appTagline: string;
  searchPlaceholder: string;
  searchButton: string;
  recentSearches: string;
  clearHistory: string;
  noRecentSearches: string;
  resultsFound: string;
  noProductsFound: string;
  noProductsSubtext: string;
  viewDetails: string;
  ingredients: string;
  allergens: string;
  noIngredients: string;
  nutritionFacts: string;
  nutritionLockedTitle: string;
  nutritionLockedDesc: string;
  upgradeCta: string;
  freeTier: string;
  proActive: string;
  proMember: string;
  billingCycle: string;
  simulateToggle: string;
  per100g: string;
  perServing: string;
  energy: string;
  fat: string;
  saturatedFat: string;
  carbs: string;
  sugars: string;
  fiber: string;
  protein: string;
  salt: string;
  sodium: string;
  categories: string;
  barcode: string;
  quantity: string;
  servingSize: string;
  close: string;
  popularSearches: string;
  searching: string;
  nutriScoreDesc: string;
  ecoScoreDesc: string;
  novaDesc: string;
  features: {
    f1: string;
    f2: string;
    f3: string;
    f4: string;
  };
}

export const translations: Record<SupportedLanguage, Translations> = {
  en: {
    appName: 'NutriScan Pro',
    appTagline: 'Packaged Food Search & Macro Intelligence',
    searchPlaceholder: 'Search by food title or barcode (e.g. Nutella, Hafermilch, Croissant)...',
    searchButton: 'Search',
    recentSearches: 'Recent Searches',
    clearHistory: 'Clear History',
    noRecentSearches: 'No recent searches recorded yet.',
    resultsFound: 'products found',
    noProductsFound: 'No packaged products found',
    noProductsSubtext: 'Try searching for a different brand, generic term, or scan barcode.',
    viewDetails: 'View Nutrition & Details',
    ingredients: 'Ingredients',
    allergens: 'Allergens',
    noIngredients: 'No ingredient list recorded for this product.',
    nutritionFacts: 'Nutrition Facts',
    nutritionLockedTitle: 'Unlock Detailed Nutritional Values',
    nutritionLockedDesc: 'Macro breakdowns, saturated fats, sugar density, and sodium analysis are reserved for active Stripe Pro subscribers.',
    upgradeCta: 'Upgrade to Pro — $9.99/mo',
    freeTier: 'Free Tier',
    proActive: 'Pro Active',
    proMember: 'Pro Subscriber',
    billingCycle: 'Monthly subscription',
    simulateToggle: 'Simulate Pro Status',
    per100g: 'Per 100g',
    perServing: 'Per Serving',
    energy: 'Energy',
    fat: 'Total Fat',
    saturatedFat: 'Saturated Fat',
    carbs: 'Carbohydrates',
    sugars: 'Sugars',
    fiber: 'Dietary Fiber',
    protein: 'Protein',
    salt: 'Salt',
    sodium: 'Sodium',
    categories: 'Categories',
    barcode: 'Barcode',
    quantity: 'Quantity',
    servingSize: 'Serving Size',
    close: 'Close',
    popularSearches: 'Popular searches:',
    searching: 'Searching Open Food Facts...',
    nutriScoreDesc: 'Nutritional quality indicator (A to E)',
    ecoScoreDesc: 'Environmental footprint impact score',
    novaDesc: 'Food processing grade (Group 1-4)',
    features: {
      f1: 'Complete macro & micronutrient breakdown',
      f2: 'Serving size calculations & daily intake %',
      f3: 'European & FDA dietary reference standards',
      f4: 'Cancel anytime in one click via Stripe',
    },
  },
  nl: {
    appName: 'NutriScan Pro',
    appTagline: 'Verpakte Voedingsmiddelen & Voedingswaarde Zoeker',
    searchPlaceholder: 'Zoek op productnaam of barcode (bijv. Hazelnootpasta, Hafermilch, Croissant)...',
    searchButton: 'Zoeken',
    recentSearches: 'Recente zoekopdrachten',
    clearHistory: 'Geschiedenis wissen',
    noRecentSearches: 'Nog geen recente zoekopdrachten geregistreerd.',
    resultsFound: 'producten gevonden',
    noProductsFound: 'Geen verpakte producten gevonden',
    noProductsSubtext: 'Probeer een andere merknaam, trefwoord of barcode.',
    viewDetails: 'Bekijk voedingswaarden & details',
    ingredients: 'Ingrediënten',
    allergens: 'Allergenen',
    noIngredients: 'Geen ingrediëntenlijst beschikbaar voor dit product.',
    nutritionFacts: 'Voedingswaardetabel',
    nutritionLockedTitle: 'Ontgrendel gedetailleerde voedingswaarden',
    nutritionLockedDesc: 'Macronutriënten, verzadigd vet, suikergehalte en natrium zijn exclusief voor actieve Stripe Pro-abonnees.',
    upgradeCta: 'Upgrade naar Pro — €9,99/mnd',
    freeTier: 'Gratis account',
    proActive: 'Pro Actief',
    proMember: 'Pro Abonnee',
    billingCycle: 'Maandelijks abonnement',
    simulateToggle: 'Simuleer Pro-status',
    per100g: 'Per 100g',
    perServing: 'Per portie',
    energy: 'Energie',
    fat: 'Vetten',
    saturatedFat: 'Waarvan verzadigde vetten',
    carbs: 'Koolhydraten',
    sugars: 'Waarvan suikers',
    fiber: 'Vezels',
    protein: 'Eiwitten',
    salt: 'Zout',
    sodium: 'Natrium',
    categories: 'Categorieën',
    barcode: 'Streepjescode',
    quantity: 'Hoeveelheid',
    servingSize: 'Portiegrootte',
    close: 'Sluiten',
    popularSearches: 'Populaire zoektermen:',
    searching: 'Open Food Facts doorzoeken...',
    nutriScoreDesc: 'Voedingswaarde indicator (A tot E)',
    ecoScoreDesc: 'Milieu-impact score van het product',
    novaDesc: 'Mate van voedselverwerking (Groep 1-4)',
    features: {
      f1: 'Volledige analyse van macro- en micronutriënten',
      f2: 'Berekening per portie en dagelijkse referentie-inname',
      f3: 'Europese & internationale voedingsnormen',
      f4: 'Op elk moment met 1 klik opzegbaar via Stripe',
    },
  },
  de: {
    appName: 'NutriScan Pro',
    appTagline: 'Suche nach verpackten Lebensmitteln & Nährwertanalyse',
    searchPlaceholder: 'Nach Produktname oder Barcode suchen (z. B. Nutella, Hafermilch, Müsli)...',
    searchButton: 'Suchen',
    recentSearches: 'Letzte Suchanfragen',
    clearHistory: 'Verlauf löschen',
    noRecentSearches: 'Noch keine Suchanfragen aufgezeichnet.',
    resultsFound: 'Produkte gefunden',
    noProductsFound: 'Keine verpackten Produkte gefunden',
    noProductsSubtext: 'Versuchen Sie einen anderen Markennamen oder Barcode.',
    viewDetails: 'Nährwerte & Details ansehen',
    ingredients: 'Zutaten',
    allergens: 'Allergene',
    noIngredients: 'Keine Zutatenliste für dieses Produkt hinterlegt.',
    nutritionFacts: 'Nährwerttabelle',
    nutritionLockedTitle: 'Detaillierte Nährwerte freischalten',
    nutritionLockedDesc: 'Vollständige Makronährstoffe, gesättigte Fettsäuren, Zucker- und Natriumgehalte sind aktiven Stripe Pro-Abonnenten vorbehalten.',
    upgradeCta: 'Auf Pro upgraden — 9,99 €/Monat',
    freeTier: 'Kostenloses Konto',
    proActive: 'Pro Aktiv',
    proMember: 'Pro Abonnent',
    billingCycle: 'Monatliches Abonnement',
    simulateToggle: 'Pro-Status simulieren',
    per100g: 'Pro 100g',
    perServing: 'Pro Portion',
    energy: 'Energie',
    fat: 'Fett',
    saturatedFat: 'Davon gesättigte Fettsäuren',
    carbs: 'Kohlenhydrate',
    sugars: 'Davon Zucker',
    fiber: 'Ballaststoffe',
    protein: 'Eiweiß',
    salt: 'Salz',
    sodium: 'Natrium',
    categories: 'Kategorien',
    barcode: 'Barcode',
    quantity: 'Menge',
    servingSize: 'Portionsgröße',
    close: 'Schließen',
    popularSearches: 'Beliebte Suchanfragen:',
    searching: 'Open Food Facts wird durchsucht...',
    nutriScoreDesc: 'Nährwertqualität-Indikator (A bis E)',
    ecoScoreDesc: 'Ökologischer Fußabdruck des Produkts',
    novaDesc: 'Verarbeitungsgrad von Lebensmitteln (1-4)',
    features: {
      f1: 'Vollständige Aufschlüsselung aller Makronährstoffe',
      f2: 'Portionsgrößenberechnung & Tagesbedarfswerte',
      f3: 'Europäische Referenzstandards für Nährstoffe',
      f4: 'Jederzeit mit einem Klick über Stripe kündbar',
    },
  },
  fr: {
    appName: 'NutriScan Pro',
    appTagline: 'Recherche de produits alimentaires & analyse nutritionnelle',
    searchPlaceholder: 'Rechercher par nom ou code-barres (ex: Nutella, Croissant, Lait)...',
    searchButton: 'Rechercher',
    recentSearches: 'Recherches récentes',
    clearHistory: 'Effacer l’historique',
    noRecentSearches: 'Aucune recherche récente pour le moment.',
    resultsFound: 'produits trouvés',
    noProductsFound: 'Aucun produit alimentaire trouvé',
    noProductsSubtext: 'Essayez un autre terme, une autre marque ou un code-barres.',
    viewDetails: 'Voir la nutrition & les détails',
    ingredients: 'Ingrédients',
    allergens: 'Allergènes',
    noIngredients: 'Aucune liste d’ingrédients enregistrée pour ce produit.',
    nutritionFacts: 'Informations nutritionnelles',
    nutritionLockedTitle: 'Débloquez les valeurs nutritionnelles détaillées',
    nutritionLockedDesc: 'La répartition précise des macronutriments, acides gras saturés, sucres et sel est réservée aux abonnés Stripe Pro.',
    upgradeCta: 'Passer à Pro — 9,99 €/mois',
    freeTier: 'Compte Gratuit',
    proActive: 'Pro Actif',
    proMember: 'Abonné Pro',
    billingCycle: 'Abonnement mensuel',
    simulateToggle: 'Simuler le statut Pro',
    per100g: 'Pour 100g',
    perServing: 'Par portion',
    energy: 'Énergie',
    fat: 'Matières grasses',
    saturatedFat: 'Dont acides gras saturés',
    carbs: 'Glucides',
    sugars: 'Dont sucres',
    fiber: 'Fibres alimentaires',
    protein: 'Protéines',
    salt: 'Sel',
    sodium: 'Sodium',
    categories: 'Catégories',
    barcode: 'Code-barres',
    quantity: 'Quantité',
    servingSize: 'Taille d’une portion',
    close: 'Fermer',
    popularSearches: 'Recherches populaires :',
    searching: 'Recherche sur Open Food Facts...',
    nutriScoreDesc: 'Indicateur de qualité nutritionnelle (A à E)',
    ecoScoreDesc: 'Score d’impact environnemental du produit',
    novaDesc: 'Degré de transformation des aliments (1 à 4)',
    features: {
      f1: 'Analyse complète des macro et micronutriments',
      f2: 'Calculs par portion et pourcentages d’apports journaliers',
      f3: 'Normes de référence nutritionnelles européennes',
      f4: 'Résiliable à tout moment en 1 clic via Stripe',
    },
  },
};
