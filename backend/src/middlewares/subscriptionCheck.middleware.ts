import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { config } from '../config/env';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        subscriptionStatus: string;
        isSubscribed: boolean;
      };
      isSubscribed?: boolean;
    }
  }
}

/**
 * Authenticate incoming request based on Bearer token in Authorization header.
 * If valid, attaches `req.user` and sets `req.isSubscribed`.
 * If absent or invalid, cleanly leaves `req.user` undefined (Guest).
 */
export function authenticateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }

    if (token) {
      const session = AuthService.getUserByToken(token);
      if (session) {
        req.user = {
          id: session.id,
          email: session.email,
          name: session.name,
          subscriptionStatus: session.subscriptionStatus,
          isSubscribed: session.subscriptionStatus === 'ACTIVE',
        };
        req.isSubscribed = session.subscriptionStatus === 'ACTIVE';
        return next();
      }
    }

    // Guest mode
    req.user = undefined;
    req.isSubscribed = false;
    next();
  } catch (error) {
    req.user = undefined;
    req.isSubscribed = false;
    next();
  }
}

// Backward-compatible alias for existing imports
export const attachDemoUser = authenticateUser;

export function requireSubscription(req: Request, res: Response, next: NextFunction) {
  if (!req.user || !req.isSubscribed) {
    return res.status(403).json({
      error: 'SubscriptionRequired',
      message: 'Detailed nutritional values are reserved for active Stripe Pro subscribers.',
      upgradeUrl: `${config.frontendUrl}/#pricing`,
    });
  }
  next();
}
