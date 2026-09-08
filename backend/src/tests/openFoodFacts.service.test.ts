import { OpenFoodFactsService } from '../services/openFoodFacts.service';

describe('OpenFoodFactsService Unit Tests', () => {
  describe('normalizeProduct', () => {
    it('should select localized title for Dutch (nl) when available', () => {
      const raw = {
        code: '7622210449283',
        product_name: 'Hazelnut Spread',
        product_name_en: 'Hazelnut Spread',
        product_name_nl: 'Hazelnootpasta',
        product_name_fr: 'Pâte à tartiner',
        brands: 'ChocoBrand',
        nutriscore_grade: 'E',
      };

      const product = OpenFoodFactsService.normalizeProduct(raw, 'nl', false);
      expect(product.name).toBe('Hazelnootpasta');
      expect(product.code).toBe('7622210449283');
      expect(product.brand).toBe('ChocoBrand');
      expect(product.nutriscoreGrade).toBe('e');
      expect(product.isFallbackEn).toBe(false);
    });

    it('should fallback to English or product_name when specific language is missing', () => {
      const raw = {
        code: '1234567890',
        product_name: 'Organic Almond Milk',
        product_name_en: 'Organic Almond Milk',
        brands: 'BioLife',
      };

      const product = OpenFoodFactsService.normalizeProduct(raw, 'de', false);
      expect(product.name).toBe('Organic Almond Milk');
      expect(product.isFallbackEn).toBe(true);
      expect(product.fallbackLanguage).toBe('en');
    });

    it('should fallback to French when a product is only available in French and searched in English', () => {
      const raw = {
        code: '3560070048897',
        product_name_fr: 'Camembert de Normandie AOP',
        ingredients_text_fr: 'Lait cru de vache, sel, présure.',
        brands: 'Reflets de France',
      };

      const product = OpenFoodFactsService.normalizeProduct(raw, 'en', false);
      expect(product.name).toBe('Camembert de Normandie AOP');
      expect(product.fallbackLanguage).toBe('fr');
      expect(product.availableLanguages).toContain('fr');
      expect(product.ingredientsText).toBe('Lait cru de vache, sel, présure.');
    });

    it('should handle missing and incomplete fields gracefully', () => {
      const raw = {
        code: '9999999999',
      };

      const product = OpenFoodFactsService.normalizeProduct(raw, 'en', false);
      expect(product.name).toBe('Unnamed Product');
      expect(product.brand).toBe('Brand Unspecified');
      expect(product.image).toBeNull();
      expect(product.nutriscoreGrade).toBe('unknown');
      expect(product.nutriments).toBeNull();
    });

    it('should gate nutrition info when includeNutrition is false', () => {
      const raw = {
        code: '5449000000996',
        product_name: 'Coca-Cola',
        nutriments: {
          'energy-kcal_100g': 42,
          'sugars_100g': 10.6,
          'fat_100g': 0,
        },
      };

      const product = OpenFoodFactsService.normalizeProduct(raw, 'en', false);
      expect(product.isNutritionalDataAvailable).toBe(true);
      expect(product.nutriments).toBeNull();
    });

    it('should extract full nutritional values when includeNutrition is true', () => {
      const raw = {
        code: '5449000000996',
        product_name: 'Coca-Cola',
        nutriments: {
          'energy-kcal_100g': 42,
          'sugars_100g': 10.6,
          'carbohydrates_100g': 10.6,
          'fat_100g': 0,
          'proteins_100g': 0,
          'salt_100g': 0,
        },
      };

      const product = OpenFoodFactsService.normalizeProduct(raw, 'en', true);
      expect(product.nutriments).toBeDefined();
      expect(product.nutriments?.energyKcal100g).toBe(42);
      expect(product.nutriments?.sugars100g).toBe(10.6);
      expect(product.nutriments?.fat100g).toBe(0);
    });
  });
});
