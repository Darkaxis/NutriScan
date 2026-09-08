import request from 'supertest';
import express from 'express';
import { ProductController } from '../controllers/product.controller';
import { requireSubscription } from '../middlewares/subscriptionCheck.middleware';
import { OpenFoodFactsService } from '../services/openFoodFacts.service';

jest.mock('../services/openFoodFacts.service');

describe('Subscription Access Enforcement', () => {
  let app: express.Express;
  let mockUser: any;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    app.use((req, res, next) => {
      req.user = mockUser;
      req.isSubscribed = mockUser?.subscriptionStatus === 'ACTIVE';
      next();
    });

    app.get('/api/products/:barcode', ProductController.getByBarcode);
    app.get('/api/products/:barcode/nutrition', requireSubscription, ProductController.getNutrition);
  });

  it('should lock nutrition values for Free demo user', async () => {
    mockUser = {
      id: 'demo-user-id',
      email: 'demo@foodsystem.test',
      subscriptionStatus: 'INACTIVE',
      isSubscribed: false,
    };

    (OpenFoodFactsService.getProductByBarcode as jest.Mock).mockResolvedValue({
      code: '3017620422003',
      name: 'Nutella',
      brand: 'Ferrero',
      image: 'https://images.openfoodfacts.org/images/products/301/762/042/2003/front_en.jpg',
      nutriscoreGrade: 'e',
      isNutritionalDataAvailable: true,
      nutriments: null,
    });

    const response = await request(app).get('/api/products/3017620422003');

    expect(response.status).toBe(200);
    expect(response.body.code).toBe('3017620422003');
    expect(response.body.nutritionLocked).toBe(true);
    expect(response.body.nutriments).toBeNull();
  });

  it('should deny access (HTTP 403) to dedicated /nutrition endpoint for Free user', async () => {
    mockUser = {
      id: 'demo-user-id',
      email: 'demo@foodsystem.test',
      subscriptionStatus: 'INACTIVE',
      isSubscribed: false,
    };

    const response = await request(app).get('/api/products/3017620422003/nutrition');

    expect(response.status).toBe(403);
    expect(response.body.error).toBe('SubscriptionRequired');
  });

  it('should unlock full nutrition values for Active Pro subscriber', async () => {
    mockUser = {
      id: 'demo-user-id',
      email: 'demo@foodsystem.test',
      subscriptionStatus: 'ACTIVE',
      isSubscribed: true,
    };

    (OpenFoodFactsService.getProductByBarcode as jest.Mock).mockResolvedValue({
      code: '3017620422003',
      name: 'Nutella',
      brand: 'Ferrero',
      image: 'https://images.openfoodfacts.org/images/products/301/762/042/2003/front_en.jpg',
      nutriscoreGrade: 'e',
      isNutritionalDataAvailable: true,
      nutriments: {
        energyKcal100g: 539,
        fat100g: 30.9,
        sugars100g: 56.3,
        proteins100g: 6.3,
      },
    });

    const response = await request(app).get('/api/products/3017620422003');

    expect(response.status).toBe(200);
    expect(response.body.nutritionLocked).toBe(false);
    expect(response.body.nutriments).toBeDefined();
    expect(response.body.nutriments.energyKcal100g).toBe(539);
  });

  it('should allow access (HTTP 200) to /nutrition endpoint for Active Pro subscriber', async () => {
    mockUser = {
      id: 'demo-user-id',
      email: 'demo@foodsystem.test',
      subscriptionStatus: 'ACTIVE',
      isSubscribed: true,
    };

    (OpenFoodFactsService.getProductByBarcode as jest.Mock).mockResolvedValue({
      code: '3017620422003',
      name: 'Nutella',
      isNutritionalDataAvailable: true,
      nutriments: {
        energyKcal100g: 539,
        fat100g: 30.9,
      },
    });

    const response = await request(app).get('/api/products/3017620422003/nutrition');

    expect(response.status).toBe(200);
    expect(response.body.nutriments.energyKcal100g).toBe(539);
  });
});
