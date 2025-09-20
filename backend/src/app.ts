import express from 'express';
import type { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRoutes from "./routes/authRoutes"
import sweetRoutes from './routes/sweetRoutes';
import type { AuthenticatedRequest } from "./middlewares/authMiddleware"
import { authenticateJWT } from './middlewares/authMiddleware';


const app: Application = express();

app.use(cors({
  origin: "https://incubyte-project-847thmnf4.vercel.app/", 
  credentials: true,     
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);
// app.use('/api/sweets', inventoryRoutes);

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
