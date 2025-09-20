import express from 'express';
import type { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRoutes from "./routes/authRoutes"
import sweetRoutes from './routes/sweetRoutes';
import type { AuthenticatedRequest } from "./middlewares/authMiddleware"
import { authenticateJWT } from './middlewares/authMiddleware';

const app: Application = express();

// Get allowed origins from environment variable or use defaults
const getAllowedOrigins = () => {
  const envOrigins = process.env.CORS_ORIGINS;
  
  if (envOrigins) {
    return envOrigins.split(',').map(origin => origin.trim());
  }
  
  return [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://incubyte-project-847thmnf4.vercel.app',
    'https://incubyte-proj-git-cce231-yuvraj-singh-thakurs-projects-be583b3f.vercel.app'
  ];
};

const corsOptions = {
  origin: function (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) {
    const allowedOrigins = getAllowedOrigins();
    
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || 
        /https:\/\/incubyte-proj.*\.vercel\.app$/.test(origin)) {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: false,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Remove the problematic line: app.options('*', cors(corsOptions));
// CORS middleware already handles OPTIONS requests

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