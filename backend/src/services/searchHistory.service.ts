import prisma from '../config/db';

export class SearchHistoryService {
  public static async recordSearch(
    userId: string,
    query: string,
    language: string = 'en',
    resultCount: number = 0
  ) {
    if (!query || query.trim().length === 0) return null;

    return await prisma.searchHistory.create({
      data: {
        userId,
        query: query.trim(),
        language,
        resultCount,
      },
    });
  }

  public static async getRecentSearches(userId: string, limit: number = 10) {
    return await prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        query: true,
        language: true,
        resultCount: true,
        createdAt: true,
      },
    });
  }

  public static async deleteSearch(id: string, userId: string) {
    return await prisma.searchHistory.deleteMany({
      where: { id, userId },
    });
  }

  public static async clearSearches(userId: string) {
    return await prisma.searchHistory.deleteMany({
      where: { userId },
    });
  }
}
