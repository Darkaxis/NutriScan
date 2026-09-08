import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  public static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, email, password } = req.body;
      if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || email.length > 128) {
        return res.status(400).json({ error: 'Valid email address is required.' });
      }
      if (!username || typeof username !== 'string' || username.trim().length < 2 || username.length > 50) {
        return res.status(400).json({ error: 'Username must be at least 2 characters (max 50).' });
      }
      if (!password || typeof password !== 'string' || password.length < 6 || password.length > 128) {
        return res.status(400).json({ error: 'Password must be at least 6 characters (max 128).' });
      }

      const result = await AuthService.register(username, email, password);
      return res.json({
        success: true,
        token: result.token,
        user: result.user,
        isSubscribed: result.user.subscriptionStatus === 'ACTIVE',
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Registration failed.' });
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { identifier, email, username, password } = req.body;
      const userIdentifier = identifier || email || username;

      if (!userIdentifier) {
        return res.status(400).json({ error: 'Email or Username is required.' });
      }
      if (!password) {
        return res.status(400).json({ error: 'Password is required.' });
      }

      const result = await AuthService.login(userIdentifier, password);
      return res.json({
        success: true,
        token: result.token,
        user: result.user,
        isSubscribed: result.user.subscriptionStatus === 'ACTIVE',
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Login failed.' });
    }
  }

  public static async logout(req: Request, res: Response) {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      AuthService.logout(token);
    }
    return res.json({ success: true, message: 'Logged out successfully.' });
  }

  public static async getMe(req: Request, res: Response) {
    if (req.user) {
      return res.json({
        user: req.user,
        isAuthenticated: true,
        isSubscribed: req.user.subscriptionStatus === 'ACTIVE',
      });
    }
    return res.status(401).json({ user: null, isAuthenticated: false, isSubscribed: false });
  }
}
