import axios from 'axios';

export type SupportedLanguage = 'en' | 'nl' | 'de' | 'fr';

export interface NutritionalValues {
  energyKcal100g?: number;
  energyKcalServing?: number;
  fat100g?: number;
  fatServing?: number;
  saturatedFat100g?: number;
  saturatedFatServing?: number;
  carbohydrates100g?: number;
  carbohydratesServing?: number;
  sugars100g?: number;
  sugarsServing?: number;
  fiber100g?: number;
  fiberServing?: number;
  proteins100g?: number;
  proteinsServing?: number;
  salt100g?: number;
  saltServing?: number;
  sodium100g?: number;
  sodiumServing?: number;
}

export interface NormalizedProduct {
  code: string;
  name: string;
  brand: string;
  image: string | null;
  thumbnail: string | null;
  quantity?: string;
  servingSize?: string;
  categories: string[];
  nutriscoreGrade: string; // 'a' | 'b' | 'c' | 'd' | 'e' | 'unknown'
  ecoscoreGrade: string;
  novaGroup?: number;
  ingredientsText: string;
  allergens: string[];
  isNutritionalDataAvailable: boolean;
  nutriments?: NutritionalValues | null;
  isFallbackEn?: boolean;
  fallbackLanguage?: string;
  availableLanguages?: string[];
}

const FALLBACK_PRODUCTS: NormalizedProduct[] = [
  {
    code: '3017620422003',
    name: 'Nutella Hazelnut Spread with Cocoa',
    brand: 'Ferrero, Nutella',
    image: 'https://static.openfoodfacts.org/images/products/301/762/042/2003/front_en.879.400.jpg',
    thumbnail: 'https://static.openfoodfacts.org/images/products/301/762/042/2003/front_en.879.200.jpg',
    quantity: '400 g',
    servingSize: '15 g',
    categories: ['Spreads', 'Sweet spreads', 'Cocoa and hazelnuts spreads'],
    nutriscoreGrade: 'e',
    ecoscoreGrade: 'd',
    novaGroup: 4,
    ingredientsText: 'Sugar, vegetable fat (palm), hazelnuts (13%), skimmed milk powder (8.7%), fat-reduced cocoa powder (7.4%), emulsifier: lecithins (soya), flavouring (vanillin).',
    allergens: ['en:soybeans', 'en:milk', 'en:nuts'],
    isNutritionalDataAvailable: true,
    nutriments: {
      energyKcal100g: 539,
      fat100g: 30.9,
      saturatedFat100g: 10.6,
      carbohydrates100g: 57.5,
      sugars100g: 56.3,
      fiber100g: 3,
      proteins100g: 6.3,
      salt100g: 0.107,
    },
  },
  {
    code: '7394376616037',
    name: 'Oatly Barista Edition Oat Drink',
    brand: 'Oatly',
    image: 'https://static.openfoodfacts.org/images/products/739/437/661/6037/front_en.161.400.jpg',
    thumbnail: 'https://static.openfoodfacts.org/images/products/739/437/661/6037/front_en.161.200.jpg',
    quantity: '1 L',
    servingSize: '100 ml',
    categories: ['Plant-based beverages', 'Oat milks'],
    nutriscoreGrade: 'b',
    ecoscoreGrade: 'a',
    novaGroup: 3,
    ingredientsText: 'Oat base (water, oats 10%), rapeseed oil, acidity regulator (dipotassium phosphate), calcium carbonate, sea salt, vitamins (D2, riboflavin, B12), potassium iodide.',
    allergens: ['en:gluten'],
    isNutritionalDataAvailable: true,
    nutriments: {
      energyKcal100g: 59,
      fat100g: 3,
      saturatedFat100g: 0.3,
      carbohydrates100g: 6.7,
      sugars100g: 4,
      fiber100g: 0.8,
      proteins100g: 1,
      salt100g: 0.1,
    },
  },
  {
    code: '3046920022606',
    name: 'Lindt Excellence Chocolat Noir 70%',
    brand: 'Lindt',
    image: 'https://static.openfoodfacts.org/images/products/304/692/002/2606/front_fr.73.400.jpg',
    thumbnail: 'https://static.openfoodfacts.org/images/products/304/692/002/2606/front_fr.73.200.jpg',
    quantity: '100 g',
    servingSize: '20 g',
    categories: ['Chocolates', 'Dark chocolates'],
    nutriscoreGrade: 'd',
    ecoscoreGrade: 'c',
    novaGroup: 3,
    ingredientsText: 'Pâte de cacao, sucre, beurre de cacao, vanille de Bourbon.',
    allergens: [],
    isNutritionalDataAvailable: true,
    nutriments: {
      energyKcal100g: 566,
      fat100g: 41,
      saturatedFat100g: 24,
      carbohydrates100g: 34,
      sugars100g: 29,
      fiber100g: 10,
      proteins100g: 9.5,
      salt100g: 0.05,
    },
  },
  {
    code: '3608580004456',
    name: 'Bonne Maman Confiture de Fraises',
    brand: 'Bonne Maman',
    image: 'https://static.openfoodfacts.org/images/products/360/858/000/4456/front_fr.63.400.jpg',
    thumbnail: 'https://static.openfoodfacts.org/images/products/360/858/000/4456/front_fr.63.200.jpg',
    quantity: '370 g',
    servingSize: '30 g',
    categories: ['Spreads', 'Jams', 'Strawberry jams'],
    nutriscoreGrade: 'c',
    ecoscoreGrade: 'b',
    novaGroup: 3,
    ingredientsText: 'Fraises, sucre, sucre de canne roux, jus de citrons concentré, gélifiant : pectines de fruits.',
    allergens: [],
    isNutritionalDataAvailable: true,
    nutriments: {
      energyKcal100g: 241,
      fat100g: 0.1,
      saturatedFat100g: 0,
      carbohydrates100g: 59,
      sugars100g: 59,
      fiber100g: 1.2,
      proteins100g: 0.4,
      salt100g: 0,
    },
  },
  {
    code: '8076800195057',
    name: 'Barilla Spaghetti n.5',
    brand: 'Barilla',
    image: 'https://static.openfoodfacts.org/images/products/807/680/019/5057/front_fr.62.400.jpg',
    thumbnail: 'https://static.openfoodfacts.org/images/products/807/680/019/5057/front_fr.62.200.jpg',
    quantity: '500 g',
    servingSize: '85 g',
    categories: ['Pastas', 'Spaghetti'],
    nutriscoreGrade: 'a',
    ecoscoreGrade: 'a',
    novaGroup: 1,
    ingredientsText: 'Semoule de blé dur, eau.',
    allergens: ['en:gluten'],
    isNutritionalDataAvailable: true,
    nutriments: {
      energyKcal100g: 359,
      fat100g: 2,
      saturatedFat100g: 0.5,
      carbohydrates100g: 71.2,
      sugars100g: 3.5,
      fiber100g: 3,
      proteins100g: 12.5,
      salt100g: 0.013,
    },
  },
  {
    code: '4001686301524',
    name: 'Haribo Goldbären Gummy Bears',
    brand: 'Haribo',
    image: 'https://static.openfoodfacts.org/images/products/400/168/630/1524/front_de.128.400.jpg',
    thumbnail: 'https://static.openfoodfacts.org/images/products/400/168/630/1524/front_de.128.200.jpg',
    quantity: '200 g',
    servingSize: '25 g',
    categories: ['Confectioneries', 'Candies', 'Gummies'],
    nutriscoreGrade: 'd',
    ecoscoreGrade: 'd',
    novaGroup: 4,
    ingredientsText: 'Glukosesirup, Zucker, Gelatine, Dextrose, Fruchtsaft aus Fruchtsaftkonzentrat: Apfel, Erdbeere, Himbeere, Orange, Zitrone, Ananas.',
    allergens: [],
    isNutritionalDataAvailable: true,
    nutriments: {
      energyKcal100g: 343,
      fat100g: 0.5,
      saturatedFat100g: 0.1,
      carbohydrates100g: 77,
      sugars100g: 46,
      fiber100g: 0,
      proteins100g: 6.9,
      salt100g: 0.07,
    },
  },
  {
    code: '8710401004123',
    name: 'Gouda Holland Kaas',
    brand: 'Gouda',
    image: 'https://static.openfoodfacts.org/images/products/871/040/100/4123/front_nl.14.400.jpg',
    thumbnail: 'https://static.openfoodfacts.org/images/products/871/040/100/4123/front_nl.14.200.jpg',
    quantity: '450 g',
    servingSize: '30 g',
    categories: ['Dairies', 'Cheeses', 'Gouda'],
    nutriscoreGrade: 'd',
    ecoscoreGrade: 'c',
    novaGroup: 3,
    ingredientsText: 'Gepasteuriseerde koemelk, zout, zuursel, stremsel, conserveermiddel: natriumnitraat, kleurstof: annatto.',
    allergens: ['en:milk'],
    isNutritionalDataAvailable: true,
    nutriments: {
      energyKcal100g: 376,
      fat100g: 31,
      saturatedFat100g: 21,
      carbohydrates100g: 0,
      sugars100g: 0,
      fiber100g: 0,
      proteins100g: 23,
      salt100g: 1.8,
    },
  },
  {
    code: '5449000000996',
    name: 'Coca-Cola Original Taste',
    brand: 'Coca-Cola',
    image: 'https://static.openfoodfacts.org/images/products/544/900/000/0996/front_en.114.400.jpg',
    thumbnail: 'https://static.openfoodfacts.org/images/products/544/900/000/0996/front_en.114.200.jpg',
    quantity: '330 ml',
    servingSize: '330 ml',
    categories: ['Beverages', 'Carbonated drinks', 'Sodas', 'Colas'],
    nutriscoreGrade: 'e',
    ecoscoreGrade: 'b',
    novaGroup: 4,
    ingredientsText: 'Carbonated water, sugar, colour (caramel E150d), acid (phosphoric acid), natural flavourings including caffeine.',
    allergens: [],
    isNutritionalDataAvailable: true,
    nutriments: {
      energyKcal100g: 42,
      fat100g: 0,
      saturatedFat100g: 0,
      carbohydrates100g: 10.6,
      sugars100g: 10.6,
      fiber100g: 0,
      proteins100g: 0,
      salt100g: 0,
    },
  },
  {
    code: '3068320114455',
    name: 'Evian Eau Minérale Naturelle',
    brand: 'Evian',
    image: 'https://static.openfoodfacts.org/images/products/306/832/011/4455/front_fr.96.400.jpg',
    thumbnail: 'https://static.openfoodfacts.org/images/products/306/832/011/4455/front_fr.96.200.jpg',
    quantity: '1.5 L',
    servingSize: '250 ml',
    categories: ['Beverages', 'Waters', 'Spring waters', 'Mineral waters'],
    nutriscoreGrade: 'a',
    ecoscoreGrade: 'a',
    novaGroup: 1,
    ingredientsText: 'Eau minérale naturelle des Alpes françaises.',
    allergens: [],
    isNutritionalDataAvailable: true,
    nutriments: {
      energyKcal100g: 0,
      fat100g: 0,
      saturatedFat100g: 0,
      carbohydrates100g: 0,
      sugars100g: 0,
      fiber100g: 0,
      proteins100g: 0,
      salt100g: 0,
    },
  },
  {
    code: '5053990101573',
    name: 'Pringles Original Crisps',
    brand: 'Pringles',
    image: 'https://static.openfoodfacts.org/images/products/505/399/010/1573/front_en.112.400.jpg',
    thumbnail: 'https://static.openfoodfacts.org/images/products/505/399/010/1573/front_en.112.200.jpg',
    quantity: '175 g',
    servingSize: '30 g',
    categories: ['Snacks', 'Salty snacks', 'Appetizers', 'Chips and fries', 'Crisps'],
    nutriscoreGrade: 'd',
    ecoscoreGrade: 'c',
    novaGroup: 4,
    ingredientsText: 'Dehydrated potatoes, vegetable oils (sunflower, palm, corn), rice flour, wheat starch, corn flour, emulsifier (E471), maltodextrin, salt, yeast extract, yeast powder, colour (annatto norbixin).',
    allergens: ['en:gluten'],
    isNutritionalDataAvailable: true,
    nutriments: {
      energyKcal100g: 526,
      fat100g: 31,
      saturatedFat100g: 3.4,
      carbohydrates100g: 56,
      sugars100g: 1.2,
      fiber100g: 3.4,
      proteins100g: 4.3,
      salt100g: 1.1,
    },
  },
  {
    code: '8715700421391',
    name: 'Heinz Tomato Ketchup',
    brand: 'Heinz',
    image: 'https://static.openfoodfacts.org/images/products/871/570/042/1391/front_en.145.400.jpg',
    thumbnail: 'https://static.openfoodfacts.org/images/products/871/570/042/1391/front_en.145.200.jpg',
    quantity: '400 ml',
    servingSize: '15 g',
    categories: ['Condiments', 'Sauces', 'Tomato sauces', 'Ketchup'],
    nutriscoreGrade: 'd',
    ecoscoreGrade: 'b',
    novaGroup: 4,
    ingredientsText: 'Tomatoes (148g per 100g Tomato Ketchup), spirit vinegar, sugar, salt, spice and herb extracts (contain celery), spice.',
    allergens: ['en:celery'],
    isNutritionalDataAvailable: true,
    nutriments: {
      energyKcal100g: 102,
      fat100g: 0.1,
      saturatedFat100g: 0.1,
      carbohydrates100g: 23.2,
      sugars100g: 22.8,
      fiber100g: 0.8,
      proteins100g: 1.2,
      salt100g: 1.8,
    },
  },
  {
    code: '8000500003787',
    name: 'Ferrero Rocher Pralines',
    brand: 'Ferrero Rocher',
    image: 'https://static.openfoodfacts.org/images/products/800/050/000/3787/front_fr.115.400.jpg',
    thumbnail: 'https://static.openfoodfacts.org/images/products/800/050/000/3787/front_fr.115.200.jpg',
    quantity: '200 g',
    servingSize: '25 g',
    categories: ['Chocolates', 'Pralines'],
    nutriscoreGrade: 'e',
    ecoscoreGrade: 'd',
    novaGroup: 4,
    ingredientsText: 'Chocolat au lait 30% (sucre, beurre de cacao, pâte de cacao, lait écrémé en poudre, beurre concentré, émulsifiants : lécithines [soja], vanilline), noisettes 28,5%, sucre, huile de palme, farine de froment, lactosérum en poudre, cacao maigre, émulsifiants : lécithines [soja], poudre à lever : carbonate acide de sodium, sel, vanilline.',
    allergens: ['en:gluten', 'en:soybeans', 'en:milk', 'en:nuts'],
    isNutritionalDataAvailable: true,
    nutriments: {
      energyKcal100g: 595,
      fat100g: 42.7,
      saturatedFat100g: 14.1,
      carbohydrates100g: 44.4,
      sugars100g: 39.9,
      fiber100g: 4,
      proteins100g: 8.2,
      salt100g: 0.153,
    },
  },
];

export class OpenFoodFactsService {
  private static readonly BASE_URL = 'https://world.openfoodfacts.org';
  private static readonly USER_AGENT = 'FoodSystemApp - Windows - Version 1.0 - info@nutrifinder.io';

  /**
   * Search for products with query, language, page, and page size
   */
  public static async searchProducts(
    query: string,
    lang: SupportedLanguage = 'en',
    page: number = 1,
    pageSize: number = 24
  ): Promise<{ products: NormalizedProduct[]; total: number; page: number; pageSize: number }> {
    if (!query || query.trim().length === 0) {
      return { products: [], total: 0, page, pageSize };
    }

    try {
      const searchUrl = `${this.BASE_URL}/cgi/search.pl`;
      const response = await axios.get(searchUrl, {
        params: {
          search_terms: query.trim(),
          search_simple: 1,
          action: 'process',
          json: 1,
          page,
          page_size: pageSize,
          fields: [
            'code',
            'product_name',
            'product_name_en',
            'product_name_fr',
            'product_name_de',
            'product_name_nl',
            'generic_name',
            'generic_name_en',
            'generic_name_fr',
            'generic_name_de',
            'generic_name_nl',
            'languages_tags',
            'brands',
            'image_url',
            'image_front_url',
            'image_front_small_url',
            'nutriscore_grade',
            'ecoscore_grade',
            'nova_group',
            'quantity',
            'serving_size',
            'categories',
            'categories_tags',
            'ingredients_text',
            'ingredients_text_en',
            'ingredients_text_fr',
            'ingredients_text_de',
            'ingredients_text_nl',
            'allergens_tags',
            'nutriments',
          ].join(','),
        },
        headers: {
          'User-Agent': this.USER_AGENT,
        },
        timeout: 10000,
      });

      const rawProducts = response.data?.products || [];
      const total = response.data?.count || rawProducts.length;

      const products = rawProducts.map((p: any) => this.normalizeProduct(p, lang, false));

      if (products.length > 0) {
        return {
          products,
          total,
          page,
          pageSize,
        };
      }

      // If empty from remote, check fallback
      const matchingFallback = this.searchFallback(query, lang);
      return {
        products: matchingFallback,
        total: matchingFallback.length,
        page,
        pageSize,
      };
    } catch (error: any) {
      console.warn(`[OpenFoodFacts] Remote API unavailable (${error.message}). Serving resilient fallback catalog.`);
      const matchingFallback = this.searchFallback(query, lang);
      return {
        products: matchingFallback,
        total: matchingFallback.length,
        page,
        pageSize,
      };
    }
  }

  /**
   * Localize a fallback product according to requested language
   */
  private static localizeFallbackProduct(p: NormalizedProduct, lang: SupportedLanguage): NormalizedProduct {
    if (p.code === '3017620422003') {
      const nutellaTranslations: Record<SupportedLanguage, { name: string; ingredients: string }> = {
        en: {
          name: 'Nutella Hazelnut Spread with Cocoa',
          ingredients: 'Sugar, vegetable fat (palm), hazelnuts (13%), skimmed milk powder (8.7%), fat-reduced cocoa powder (7.4%), emulsifier: lecithins (soya), flavouring (vanillin).',
        },
        fr: {
          name: 'Nutella pâte à tartiner aux noisettes et au cacao',
          ingredients: 'Sucre, huile de palme, noisettes 13%, cacao maigre 7,4%, lait écrémé en poudre 6,6%, lactosérum en poudre, émulsifiants : lécithines [soja], vanilline.',
        },
        de: {
          name: 'Nutella Nuss-Nougat-Creme',
          ingredients: 'Zucker, Palmöl, Haselnüsse 13 %, Magermilchpulver 8,7 %, fettarmer Kakao, Emulgator Lecithine (Soja), Vanillin.',
        },
        nl: {
          name: 'Nutella hazelnootpasta met cacao',
          ingredients: 'Suiker, palmolie, hazelnoten 13%, magere cacao 7,4%, magere melkpoeder 6,6%, weipoeder, emulgatoren: lecithinen [soja], vanilline.',
        },
      };
      const hasSpecific = !!nutellaTranslations[lang];
      const t = nutellaTranslations[lang] || nutellaTranslations.en;
      return {
        ...p,
        name: t.name,
        ingredientsText: t.ingredients,
        isFallbackEn: lang !== 'en' && !hasSpecific,
        fallbackLanguage: !hasSpecific && lang !== 'en' ? 'en' : undefined,
        availableLanguages: ['en', 'fr', 'de', 'nl'],
      };
    }
    const isFallback = lang !== 'en';
    return {
      ...p,
      isFallbackEn: isFallback,
      fallbackLanguage: isFallback ? 'en' : undefined,
      availableLanguages: ['en'],
    };
  }

  /**
   * Search local resilient catalog when Open Food Facts remote API is offline
   */
  private static searchFallback(query: string, lang: SupportedLanguage = 'en'): NormalizedProduct[] {
    const q = query.toLowerCase().trim();
    if (!q) return FALLBACK_PRODUCTS.map((p) => this.localizeFallbackProduct(p, lang));

    const matches = FALLBACK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.categories.some((c) => c.toLowerCase().includes(q))
    );

    const results = matches.length > 0 ? matches : FALLBACK_PRODUCTS;
    return results.map((p) => this.localizeFallbackProduct(p, lang));
  }

  /**
   * Fetch a single product by barcode, optionally including full nutrition
   */
  public static async getProductByBarcode(
    barcode: string,
    lang: SupportedLanguage = 'en',
    includeNutrition: boolean = false
  ): Promise<NormalizedProduct | null> {
    try {
      const url = `${this.BASE_URL}/api/v2/product/${encodeURIComponent(barcode)}.json`;
      const response = await axios.get(url, {
        headers: {
          'User-Agent': this.USER_AGENT,
        },
        timeout: 6000,
      });

      if (response.data?.status === 1 && response.data?.product) {
        return this.normalizeProduct(response.data.product, lang, includeNutrition);
      }
    } catch (error: any) {
      console.warn(`[OpenFoodFacts] Barcode fetch failed for ${barcode}:`, error.message);
    }

    // Fallback to local catalog if remote is offline or product not found
    const fallback = FALLBACK_PRODUCTS.find((p) => p.code === barcode);
    if (fallback) {
      const localized = this.localizeFallbackProduct(fallback, lang);
      return includeNutrition ? localized : { ...localized, nutriments: null };
    }

    return null;
  }

  /**
   * Normalize raw Open Food Facts product structure into a clean, localized domain object
   */
  public static normalizeProduct(
    raw: any,
    lang: SupportedLanguage = 'en',
    includeNutrition: boolean = false
  ): NormalizedProduct {
    // 1. Detect which languages actually have data recorded on this product
    const candidateLocales: SupportedLanguage[] = ['en', 'fr', 'de', 'nl'];
    const availableLanguagesSet = new Set<string>();

    for (const loc of candidateLocales) {
      if (raw[`product_name_${loc}`]?.trim() || raw[`ingredients_text_${loc}`]?.trim() || raw[`generic_name_${loc}`]?.trim()) {
        availableLanguagesSet.add(loc);
      }
    }

    // Also check languages_tags from Open Food Facts if present
    if (Array.isArray(raw.languages_tags)) {
      raw.languages_tags.forEach((tag: string) => {
        const clean = tag.replace(/^[a-z]{2}:/, '').toLowerCase();
        if (['en', 'fr', 'de', 'nl'].includes(clean)) {
          availableLanguagesSet.add(clean);
        }
      });
    }

    // If generic product_name or ingredients_text exists, en is available
    if (raw.product_name?.trim() || raw.ingredients_text?.trim() || raw.product_name_en?.trim() || raw.ingredients_text_en?.trim()) {
      availableLanguagesSet.add('en');
    }

    const availableLanguages = Array.from(availableLanguagesSet);

    // 2. Localized title resolution with full multi-language fallback chain
    let localizedName = raw[`product_name_${lang}`]?.trim() || raw[`generic_name_${lang}`]?.trim();
    let fallbackLanguage: string | undefined = undefined;

    if (!localizedName) {
      // Fallback priority: English -> French -> German -> Dutch -> generic product_name
      const fallbackOrder: SupportedLanguage[] = (['en', 'fr', 'de', 'nl'] as SupportedLanguage[]).filter((l) => l !== lang);
      for (const fallbackCode of fallbackOrder) {
        const candidate = raw[`product_name_${fallbackCode}`]?.trim() || raw[`generic_name_${fallbackCode}`]?.trim();
        if (candidate) {
          localizedName = candidate;
          fallbackLanguage = fallbackCode;
          break;
        }
      }
      if (!localizedName) {
        localizedName = raw.product_name?.trim() || raw.generic_name?.trim() || 'Unnamed Product';
        if (raw.product_name?.trim() || raw.generic_name?.trim()) {
          fallbackLanguage = 'en';
        }
      }
    }

    const isFallbackEn = fallbackLanguage === 'en';

    // 3. Brand resolution
    const brand = raw.brands?.trim() || 'Brand Unspecified';

    // 4. Image resolution (use static.openfoodfacts.org for maximum availability & fast delivery)
    const rawImage = raw.image_url || raw.image_front_url || null;
    const rawThumbnail = raw.image_front_small_url || rawImage || null;
    const image = rawImage ? rawImage.replace('https://images.openfoodfacts.org', 'https://static.openfoodfacts.org') : null;
    const thumbnail = rawThumbnail ? rawThumbnail.replace('https://images.openfoodfacts.org', 'https://static.openfoodfacts.org') : null;

    // 5. Scores & Grades
    const nutriscoreGrade = (raw.nutriscore_grade || 'unknown').toLowerCase();
    const ecoscoreGrade = (raw.ecoscore_grade || 'unknown').toLowerCase();
    const novaGroup = raw.nova_group ? Number(raw.nova_group) : undefined;

    // 6. Localized ingredients with matching fallback
    let ingredientsText = raw[`ingredients_text_${lang}`]?.trim();
    if (!ingredientsText) {
      const fallbackOrder: SupportedLanguage[] = (['en', 'fr', 'de', 'nl'] as SupportedLanguage[]).filter((l) => l !== lang);
      for (const fallbackCode of fallbackOrder) {
        const candidate = raw[`ingredients_text_${fallbackCode}`]?.trim();
        if (candidate) {
          ingredientsText = candidate;
          break;
        }
      }
      if (!ingredientsText) {
        ingredientsText = raw.ingredients_text_en?.trim() || raw.ingredients_text?.trim() || '';
      }
    }

    // 6. Categories & Allergens
    const categories = Array.isArray(raw.categories_tags)
      ? raw.categories_tags.map((c: string) => c.replace(/^[a-z]{2}:/, '').replace(/-/g, ' '))
      : typeof raw.categories === 'string'
      ? raw.categories.split(',').map((c: string) => c.trim()).filter(Boolean)
      : [];

    const allergens = Array.isArray(raw.allergens_tags)
      ? raw.allergens_tags.map((a: string) => a.replace(/^[a-z]{2}:/, '').replace(/-/g, ' '))
      : [];

    // 7. Check if nutritional data exists in raw nutriments
    const rawNutriments = raw.nutriments || {};
    const hasNutritionalData =
      rawNutriments['energy-kcal_100g'] !== undefined ||
      rawNutriments['fat_100g'] !== undefined ||
      rawNutriments['carbohydrates_100g'] !== undefined ||
      rawNutriments['proteins_100g'] !== undefined;

    // 8. Extract nutritional values if authorized
    let nutriments: NutritionalValues | null = null;
    if (includeNutrition && hasNutritionalData) {
      nutriments = {
        energyKcal100g: this.parseNumber(rawNutriments['energy-kcal_100g']),
        energyKcalServing: this.parseNumber(rawNutriments['energy-kcal_serving']),
        fat100g: this.parseNumber(rawNutriments['fat_100g']),
        fatServing: this.parseNumber(rawNutriments['fat_serving']),
        saturatedFat100g: this.parseNumber(rawNutriments['saturated-fat_100g']),
        saturatedFatServing: this.parseNumber(rawNutriments['saturated-fat_serving']),
        carbohydrates100g: this.parseNumber(rawNutriments['carbohydrates_100g']),
        carbohydratesServing: this.parseNumber(rawNutriments['carbohydrates_serving']),
        sugars100g: this.parseNumber(rawNutriments['sugars_100g']),
        sugarsServing: this.parseNumber(rawNutriments['sugars_serving']),
        fiber100g: this.parseNumber(rawNutriments['fiber_100g']),
        fiberServing: this.parseNumber(rawNutriments['fiber_serving']),
        proteins100g: this.parseNumber(rawNutriments['proteins_100g']),
        proteinsServing: this.parseNumber(rawNutriments['proteins_serving']),
        salt100g: this.parseNumber(rawNutriments['salt_100g']),
        saltServing: this.parseNumber(rawNutriments['salt_serving']),
        sodium100g: this.parseNumber(rawNutriments['sodium_100g']),
        sodiumServing: this.parseNumber(rawNutriments['sodium_serving']),
      };
    }

    return {
      code: String(raw.code || raw.id || ''),
      name: localizedName,
      brand,
      image,
      thumbnail,
      quantity: raw.quantity || undefined,
      servingSize: raw.serving_size || undefined,
      categories: categories.slice(0, 5),
      nutriscoreGrade,
      ecoscoreGrade,
      novaGroup,
      ingredientsText,
      allergens,
      isNutritionalDataAvailable: hasNutritionalData,
      nutriments,
      isFallbackEn,
      fallbackLanguage,
      availableLanguages,
    };
  }

  private static parseNumber(val: any): number | undefined {
    if (val === undefined || val === null || val === '') return undefined;
    const parsed = Number(val);
    return isNaN(parsed) ? undefined : Math.round(parsed * 100) / 100;
  }
}
