import express from 'express';
import type { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRoutes from "./routes/authRoutes"
import sweetRoutes from './routes/sweetRoutes';
import type { AuthenticatedRequest } from "./middlewares/authMiddleware"
import { authenticateJWT } from './middlewares/authMiddleware';

const app: Application = express();

// CORS configuration - FIXED
const corsOptions = {
  origin: function (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://incubyte-project-847thmnf4.vercel.app',  // Remove trailing slash
      'https://incubyte-proj-git-cce231-yuvraj-singh-thakurs-projects-be583b3f.vercel.app',
      // Add your current deployment URL
      // You can also use regex patterns for dynamic Vercel URLs
      /https:\/\/incubyte-proj.*\.vercel\.app$/
    ];
    
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return allowedOrigin === origin;
      } else {
        return allowedOrigin.test(origin);
      }
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: false,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Add explicit OPTIONS handler for preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('Sweet Shop Management API is running');
});

app.get('/api/protected', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  res.json({ message: 'This is a protected route', userId: req.user?.id });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

export default app;