import { StripeService } from '../services/stripe.service';
import prisma from '../config/db';

jest.mock('../config/db', () => ({
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
  },
}));

describe('Stripe Webhook Processing Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should activate user subscription on checkout.session.completed', async () => {
    const mockEvent = {
      type: 'checkout.session.completed',
      data: {
        object: {
          client_reference_id: 'user_123',
          customer: 'cus_99999',
          subscription: 'sub_88888',
        },
      },
    };

    (prisma.user.update as jest.Mock).mockResolvedValue({
      id: 'user_123',
      subscriptionStatus: 'ACTIVE',
    });

    const result = await StripeService.processWebhook(JSON.stringify(mockEvent), 'dummy_sig');

    expect(result.received).toBe(true);
    expect(result.eventType).toBe('checkout.session.completed');
    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'user_123' },
        data: expect.objectContaining({
          subscriptionStatus: 'ACTIVE',
          stripeCustomerId: 'cus_99999',
          stripeSubscriptionId: 'sub_88888',
        }),
      })
    );
  });

  it('should cancel subscription on customer.subscription.deleted', async () => {
    const mockEvent = {
      type: 'customer.subscription.deleted',
      data: {
        object: {
          id: 'sub_88888',
        },
      },
    };

    (prisma.user.findFirst as jest.Mock).mockResolvedValue({
      id: 'user_123',
      stripeSubscriptionId: 'sub_88888',
    });

    (prisma.user.update as jest.Mock).mockResolvedValue({
      id: 'user_123',
      subscriptionStatus: 'CANCELED',
    });

    const result = await StripeService.processWebhook(JSON.stringify(mockEvent), 'dummy_sig');

    expect(result.received).toBe(true);
    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'user_123' },
        data: expect.objectContaining({
          subscriptionStatus: 'CANCELED',
        }),
      })
    );
  });

  it('should cancel subscription directly via cancelSubscription', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'user_123',
      subscriptionStatus: 'ACTIVE',
      stripeSubscriptionId: 'sub_mock_123',
    });

    (prisma.user.update as jest.Mock).mockResolvedValue({
      id: 'user_123',
      subscriptionStatus: 'CANCELED',
    });

    const success = await StripeService.cancelSubscription('user_123');

    expect(success).toBe(true);
    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'user_123' },
        data: expect.objectContaining({
          subscriptionStatus: 'CANCELED',
        }),
      })
    );
  });
});
