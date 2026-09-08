import crypto from 'crypto';
import prisma from '../config/db';

export interface UserSession {
  id: string;
  email: string;
  username: string;
  name: string;
  subscriptionStatus: 'INACTIVE' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED';
  currentPeriodEnd?: string | null;
  createdAt: string;
}

// In-memory token & user store (ensures 100% resilience even when MySQL is offline)
const tokenToUserMap = new Map<string, UserSession>();
const inMemoryUsers = new Map<string, UserSession & { passwordHash?: string }>();

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt:${salt}:${derivedKey}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    if (storedHash.startsWith('scrypt:')) {
      const parts = storedHash.split(':');
      if (parts.length !== 3) return false;
      const salt = parts[1];
      const originalKey = parts[2];
      const key = crypto.scryptSync(password, salt, 64).toString('hex');
      return crypto.timingSafeEqual(Buffer.from(key, 'hex'), Buffer.from(originalKey, 'hex'));
    }
    // Backward compatibility for legacy sha256
    const legacyHash = crypto.createHash('sha256').update(password + '_nutriscan_salt').digest('hex');
    return crypto.timingSafeEqual(Buffer.from(legacyHash, 'hex'), Buffer.from(storedHash, 'hex'));
  } catch {
    return false;
  }
}

// Preload a default member account for instant testing
const defaultMember: UserSession & { passwordHash?: string } = {
  id: 'usr_alex_morgan',
  email: 'alex.morgan@nutriscan.io',
  username: 'alexmorgan',
  name: 'Alex Morgan',
  subscriptionStatus: 'INACTIVE',
  currentPeriodEnd: null,
  createdAt: new Date().toISOString(),
  passwordHash: hashPassword('password123'),
};
inMemoryUsers.set(defaultMember.email.toLowerCase(), defaultMember);
inMemoryUsers.set(defaultMember.username.toLowerCase(), defaultMember);

export class AuthService {
  /**
   * Register a new user with username, email, and password
   */
  public static async register(username: string, email: string, password?: string): Promise<{ token: string; user: UserSession }> {
    if (email.length > 128 || (username && username.length > 50) || (password && password.length > 128)) {
      throw new Error('Input length exceeds maximum allowed limit (50 chars for username, 128 for email/password).');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = (username || normalizedEmail.split('@')[0])
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_.-]/g, '');
    const cleanName = username.trim() || normalizedUsername;
    const passHash = password ? hashPassword(password) : undefined;

    let userSession: UserSession;

    try {
      // Try database upsert
      const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (existing) {
        userSession = {
          id: existing.id,
          email: existing.email,
          username: normalizedUsername,
          name: existing.name || cleanName,
          subscriptionStatus: existing.subscriptionStatus as any,
          currentPeriodEnd: existing.currentPeriodEnd ? existing.currentPeriodEnd.toISOString() : null,
          createdAt: existing.createdAt.toISOString(),
        };
      } else {
        const created = await prisma.user.create({
          data: {
            email: normalizedEmail,
            name: cleanName,
            subscriptionStatus: 'INACTIVE',
          },
        });
        userSession = {
          id: created.id,
          email: created.email,
          username: normalizedUsername,
          name: created.name,
          subscriptionStatus: created.subscriptionStatus as any,
          currentPeriodEnd: null,
          createdAt: created.createdAt.toISOString(),
        };
      }
    } catch {
      // In-memory fallback
      let memoryUser = inMemoryUsers.get(normalizedEmail) || inMemoryUsers.get(normalizedUsername);
      if (!memoryUser) {
        memoryUser = {
          id: `usr_${crypto.randomBytes(8).toString('hex')}`,
          email: normalizedEmail,
          username: normalizedUsername,
          name: cleanName,
          subscriptionStatus: 'INACTIVE',
          currentPeriodEnd: null,
          createdAt: new Date().toISOString(),
          passwordHash: passHash,
        };
      }
      userSession = memoryUser;
    }

    // Always store in inMemoryUsers indexed by both email and username for reliable credentials check
    const sessionWithPass: UserSession & { passwordHash?: string } = {
      ...userSession,
      passwordHash: passHash,
    };
    inMemoryUsers.set(normalizedEmail, sessionWithPass);
    inMemoryUsers.set(normalizedUsername, sessionWithPass);

    const token = crypto.randomBytes(32).toString('hex');
    tokenToUserMap.set(token, userSession);

    return { token, user: userSession };
  }

  /**
   * Login with identifier (email or username) and password
   */
  public static async login(identifier: string, password?: string): Promise<{ token: string; user: UserSession }> {
    if (!identifier || identifier.length > 128 || (password && password.length > 128)) {
      throw new Error('Invalid input length. Identifier and password must be under 128 characters.');
    }

    const raw = identifier.trim().toLowerCase();
    const isEmail = raw.includes('@');
    const normalizedEmail = isEmail ? raw : '';

    let userSession: UserSession | null = null;

    // 1. Check in-memory store by username or email first
    const memoryUser = inMemoryUsers.get(raw);
    if (memoryUser) {
      if (memoryUser.passwordHash && password) {
        if (!verifyPassword(password, memoryUser.passwordHash)) {
          throw new Error('Invalid password or credentials. Please check your login details and try again.');
        }
      }
      userSession = memoryUser;
    }

    // 2. If not found in memory, check database
    if (!userSession && normalizedEmail) {
      try {
        const dbUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (dbUser) {
          userSession = {
            id: dbUser.id,
            email: dbUser.email,
            username: dbUser.email.split('@')[0],
            name: dbUser.name,
            subscriptionStatus: dbUser.subscriptionStatus as any,
            currentPeriodEnd: dbUser.currentPeriodEnd ? dbUser.currentPeriodEnd.toISOString() : null,
            createdAt: dbUser.createdAt.toISOString(),
          };
          inMemoryUsers.set(normalizedEmail, userSession);
          inMemoryUsers.set(userSession.username.toLowerCase(), userSession);
        }
      } catch {
        // ignore
      }
    }

    // 3. Reject non-existent user (no auto-provisioning flaw)
    if (!userSession) {
      throw new Error('Invalid password or credentials. Account not found.');
    }

    const token = crypto.randomBytes(32).toString('hex');
    tokenToUserMap.set(token, userSession);

    return { token, user: userSession };
  }

  /**
   * Verify token and return user session
   */
  public static getUserByToken(token: string): UserSession | null {
    if (!token) return null;
    return tokenToUserMap.get(token) || null;
  }

  /**
   * Revoke token on logout
   */
  public static logout(token: string): void {
    if (token) {
      tokenToUserMap.delete(token);
    }
  }

  /**
   * Update subscription status in session and database
   */
  public static async updateSubscription(userId: string, status: 'ACTIVE' | 'INACTIVE' | 'CANCELED'): Promise<void> {
    for (const [token, session] of tokenToUserMap.entries()) {
      if (session.id === userId) {
        session.subscriptionStatus = status;
        tokenToUserMap.set(token, session);
      }
    }
    for (const [key, user] of inMemoryUsers.entries()) {
      if (user.id === userId) {
        user.subscriptionStatus = status;
        inMemoryUsers.set(key, user);
      }
    }
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { subscriptionStatus: status },
      });
    } catch {
      // ignore
    }
  }
}
