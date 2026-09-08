import { Request, Response, NextFunction } from 'express';
import { SearchHistoryService } from '../services/searchHistory.service';

export class SearchController {
  public static async getRecent(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.json({ recentSearches: [] });
      }

      const rawLimit = parseInt((req.query.limit as string) || '10', 10);
      const limit = isNaN(rawLimit) ? 10 : Math.max(1, Math.min(rawLimit, 50));
      const searches = await SearchHistoryService.getRecentSearches(userId, limit);

      return res.json({ recentSearches: searches });
    } catch (error) {
      console.warn('Database unreachable in getRecent, returning empty searches list:', (error as Error)?.message);
      return res.json({ recentSearches: [] });
    }
  }

  public static async deleteOne(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!id || typeof id !== 'string' || id.length > 64) {
        return res.status(400).json({ error: 'BadRequest', message: 'Valid search entry id is required.' });
      }

      await SearchHistoryService.deleteSearch(id, userId);
      return res.json({ success: true, message: 'Search history entry deleted.' });
    } catch (error) {
      next(error);
    }
  }

  public static async clearAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      await SearchHistoryService.clearSearches(userId);
      return res.json({ success: true, message: 'All search history cleared.' });
    } catch (error) {
      next(error);
    }
  }
}
