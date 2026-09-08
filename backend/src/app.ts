import express from 'express';
import cors from 'cors';
import routes from './routes';
import { attachDemoUser } from './middlewares/subscriptionCheck.middleware';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { StripeController } from './controllers/stripe.controller';
import { config } from './config/env';

export const app = express();
app.disable('x-powered-by');

// Defense-in-depth HTTP Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '0');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), StripeController.handleWebhook);

app.use(
  cors({
    origin: [config.frontendUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use(attachDemoUser);

app.use('/api', routes);

app.use(errorHandler);

export default app;
