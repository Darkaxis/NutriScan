import { Request, Response, NextFunction } from 'express';
import { OpenFoodFactsService, SupportedLanguage } from '../services/openFoodFacts.service';
import { SearchHistoryService } from '../services/searchHistory.service';

export class ProductController {
  public static async search(req: Request, res: Response, next: NextFunction) {
    try {
      const query = ((req.query.q as string) || '').slice(0, 100);
      const rawLang = ((req.query.lang as string) || (req.query.language as string) || 'en').toLowerCase();
      const validLangs: SupportedLanguage[] = ['en', 'nl', 'de', 'fr'];
      const resolvedLang: SupportedLanguage = validLangs.includes(rawLang as SupportedLanguage) ? (rawLang as SupportedLanguage) : 'en';
      const rawPage = parseInt((req.query.page as string) || '1', 10);
      const page = isNaN(rawPage) ? 1 : Math.max(1, Math.min(rawPage, 1000));
      const rawPageSize = parseInt((req.query.pageSize as string) || '24', 10);
      const pageSize = isNaN(rawPageSize) ? 24 : Math.max(1, Math.min(rawPageSize, 50));

      if (!query.trim()) {
        return res.json({
          products: [],
          total: 0,
          page: 1,
          pageSize,
        });
      }

      const result = await OpenFoodFactsService.searchProducts(query, resolvedLang, page, pageSize);

      const isGuest = !req.user;
      const GUEST_LIMIT = 4;
      const GUEST_PREVIEW_LIMIT = 8;

      if (req.user?.id) {
        SearchHistoryService.recordSearch(req.user.id, query, resolvedLang, result.total).catch((err) =>
          console.warn('Could not record search history:', err.message)
        );
      }

      const products = isGuest ? result.products.slice(0, GUEST_PREVIEW_LIMIT) : result.products;

      return res.json({
        products,
        total: result.total,
        page: result.page,
        pageSize: isGuest ? GUEST_LIMIT : result.pageSize,
        isGuest,
        guestLimit: GUEST_LIMIT,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getByBarcode(req: Request, res: Response, next: NextFunction) {
    try {
      const { barcode } = req.params;
      if (!barcode || typeof barcode !== 'string' || !/^[a-zA-Z0-9_-]{1,32}$/.test(barcode.trim())) {
        return res.status(400).json({
          error: 'InvalidBarcode',
          message: 'Barcode must be an alphanumeric string between 1 and 32 characters.',
        });
      }

      const cleanBarcode = barcode.trim();
      const rawLang = ((req.query.lang as string) || (req.query.language as string) || 'en').toLowerCase();
      const validLangs: SupportedLanguage[] = ['en', 'nl', 'de', 'fr'];
      const resolvedLang: SupportedLanguage = validLangs.includes(rawLang as SupportedLanguage) ? (rawLang as SupportedLanguage) : 'en';

      const isSubscribed = Boolean(req.isSubscribed);

      const product = await OpenFoodFactsService.getProductByBarcode(cleanBarcode, resolvedLang, isSubscribed);

      if (!product) {
        return res.status(404).json({
          error: 'NotFound',
          message: `Product with barcode ${cleanBarcode} was not found on Open Food Facts.`,
        });
      }

      return res.json({
        ...product,
        nutritionLocked: !isSubscribed,
        userSubscriptionStatus: req.user?.subscriptionStatus || 'INACTIVE',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getNutrition(req: Request, res: Response, next: NextFunction) {
    try {
      const { barcode } = req.params;
      if (!barcode || typeof barcode !== 'string' || !/^[a-zA-Z0-9_-]{1,32}$/.test(barcode.trim())) {
        return res.status(400).json({
          error: 'InvalidBarcode',
          message: 'Barcode must be an alphanumeric string between 1 and 32 characters.',
        });
      }

      const cleanBarcode = barcode.trim();
      const lang = ((req.query.lang as string) || 'en').toLowerCase() as SupportedLanguage;

      const product = await OpenFoodFactsService.getProductByBarcode(cleanBarcode, lang, true);

      if (!product) {
        return res.status(404).json({
          error: 'NotFound',
          message: `Product with barcode ${barcode} not found.`,
        });
      }

      return res.json({
        code: product.code,
        name: product.name,
        nutriments: product.nutriments,
        isNutritionalDataAvailable: product.isNutritionalDataAvailable,
      });
    } catch (error) {
      next(error);
    }
  }
}
