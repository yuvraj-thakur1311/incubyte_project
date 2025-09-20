# Sweet Shop Management System

A full-stack web application for managing a sweet shop with user authentication, inventory management, and role-based access control. Built with Node.js/TypeScript backend and React frontend.

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [API Endpoints](#api-endpoints)
- [Test Credentials](#test-credentials)
- [Running Tests](#running-tests)
- [Screenshots](#screenshots)
- [My AI Usage](#my-ai-usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## Features

### User Authentication
- User registration and login with JWT token-based authentication
- Role-based access control (Admin and Regular User)
- Secure password hashing with bcrypt

### Sweet Management (Admin Only)
- Add new sweets to inventory
- Update existing sweet details
- Delete sweets from inventory
- Real-time inventory tracking

### Sweet Browsing & Purchase
- View all available sweets
- Search and filter sweets by name and category
- Purchase sweets (decreases quantity)
- Real-time stock updates

### Inventory Management
- Purchase functionality for users
- Restock functionality for admins
- Automatic quantity tracking
- Stock availability validation

## Technology Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Testing**: Jest with Supertest
- **API Documentation**: RESTful API design

### Frontend
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Testing**: Jest with React Testing Library

### Development Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Code Quality**: ESLint, Prettier
- **Testing**: Comprehensive test suite with coverage reporting

## Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB (v4.4 or higher) - running locally or MongoDB Atlas connection string
- Git

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/sweet-shop-management.git
cd sweet-shop-management
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment variables file
cp .env.example .env

# Edit .env file with your configuration:
# MONGO_URI=mongodb://localhost:27017/sweetshop
# JWT_SECRET=your-super-secret-jwt-key-here
# PORT=5000

# Start the backend server
npm run dev
```

### 3. Frontend Setup
```bash
# Open a new terminal and navigate to frontend directory
cd sweet-frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

### 4. Database Setup

The application will automatically create the required collections. For initial testing, you can use the provided seed script or the test credentials below.

#### Seed Admin User (Optional)
```bash
cd backend
npm run seed
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Sweets (Protected Routes)
- `GET /api/sweets` - Get all sweets
- `GET /api/sweets/search` - Search sweets by name/category
- `POST /api/sweets` - Add new sweet (Admin only)
- `PUT /api/sweets/:id` - Update sweet (Admin only)
- `DELETE /api/sweets/:id` - Delete sweet (Admin only)

### Inventory (Protected Routes)
- `POST /api/sweets/:id/purchase` - Purchase sweet
- `POST /api/sweets/:id/restock` - Restock sweet (Admin only)

## Test Credentials

Use these credentials to test the application:

### Admin User
- **Email**: `admin@sweetshop.com`
- **Password**: `admin123`
- **Capabilities**: Full access to all features including adding, editing, deleting sweets and restocking inventory

### Regular User
- **Email**: `user@sweetshop.com`
- **Password**: `user123`
- **Capabilities**: Can browse sweets, search, and make purchases

### Creating Your Own Accounts
You can also register new accounts through the registration form. Admin privileges are assigned manually through the database.

## Running Tests

### Backend Tests
```bash
cd backend
npm test

# Run tests with coverage
npm run test:coverage

# Generate HTML test report
npm run test:report
```

### Frontend Tests
```bash
cd sweet-frontend
npm test

# Run tests with coverage
npm run test:coverage
```

### Full Test Suite
```bash
# From root directory
npm run test:all
```

The test suite includes:
- **Authentication Tests**: Registration, login, JWT validation
- **API Endpoint Tests**: CRUD operations for sweets
- **Inventory Tests**: Purchase and restock functionality
- **Middleware Tests**: Authentication and authorization
- **Integration Tests**: Complete user workflows
- **Frontend Tests**: Component rendering and user interactions

**Test Coverage**: 89.5% overall with 36+ comprehensive test cases

## Screenshots

### Login Page
![Login Page](./screenshots/login.png)
*User authentication with role-based access*

### Admin Dashboard
![Admin Dashboard](./screenshots/admin-dashboard.png)
*Admin view with full inventory management capabilities*

### User Dashboard
![User Dashboard](./screenshots/user-dashboard.png)
*Regular user view for browsing and purchasing sweets*

### Add/Edit Sweet Modal
![Sweet Management](./screenshots/sweet-modal.png)
*Admin interface for managing sweet inventory*

### Search & Filter
![Search Functionality](./screenshots/search.png)
*Real-time search and filtering capabilities*

## My AI Usage

### AI Tools Used
- **Claude (Anthropic)**: Primary AI assistant for code generation and problem-solving
- **GitHub Copilot**: Code completion and suggestions during development

### How AI Was Utilized

#### Backend Development
- **API Structure**: Used Claude to design RESTful API endpoints and establish proper routing patterns
- **Authentication Logic**: AI assisted in implementing JWT token-based authentication and middleware setup
- **Test Suite Creation**: Generated comprehensive test cases covering authentication, CRUD operations, and edge cases
- **Error Handling**: AI helped implement consistent error handling patterns across all endpoints

#### Frontend Development
- **Component Styling**: Leveraged AI for Tailwind CSS class combinations and responsive design patterns
- **State Management**: Used AI to implement React Context for authentication state and user role management
- **Real-time Updates**: AI assisted in creating logic for immediate UI updates when admin makes changes that should reflect in user views
- **Form Validation**: Generated client-side validation logic for registration and sweet management forms

#### Specific AI Contributions
1. **Edit Sweet Functionality**: AI helped implement the single-card edit feature where changes reflect immediately without full page refresh
2. **Role-based UI Rendering**: Used AI to create conditional rendering logic that shows different interfaces for admin vs regular users
3. **Purchase Flow**: AI assisted in creating the purchase logic that updates inventory counts and handles stock availability
4. **Responsive Design**: Leveraged AI for mobile-first design patterns and cross-device compatibility

#### Testing
- **Test Case Generation**: AI generated 36+ comprehensive test cases covering all API endpoints
- **Mock Data Creation**: Used AI to create realistic test data and user scenarios
- **Coverage Analysis**: AI helped identify untested code paths and edge cases

### Impact on Development Workflow

**Positive Impacts:**
- **Rapid Prototyping**: AI enabled quick iteration on features and immediate testing of concepts
- **Code Quality**: AI suggestions improved code structure and adherence to best practices
- **Comprehensive Testing**: AI helped create thorough test suites I might not have written manually
- **Problem Solving**: AI provided alternative approaches when stuck on implementation details

**Learning Experience:**
- Enhanced understanding of TypeScript patterns and React best practices
- Improved knowledge of testing methodologies and TDD approaches
- Better grasp of authentication flows and security considerations
- Developed skills in prompt engineering for more effective AI collaboration

**AI as a Collaborative Tool:**
Rather than replacing my thinking, AI served as an intelligent pair programming partner, helping me explore ideas, catch potential issues, and implement solutions more efficiently. The final code represents a collaboration between human creativity and AI capabilities.

## Project Structure

```
sweet-shop-management/
├── backend/
│   ├── src/
│   │   ├── controllers/         # API endpoint handlers
│   │   ├── middlewares/         # Authentication & authorization
│   │   ├── models/             # MongoDB schemas
│   │   ├── routes/             # API route definitions
│   │   ├── config/             # Database configuration
│   │   └── app.ts              # Express application setup
│   ├── tests/                  # Comprehensive test suite
│   ├── .env.example           # Environment variables template
│   └── package.json
├── sweet-frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── contexts/           # Context providers
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API service layer
│   │   ├── types/              # TypeScript type definitions
│   │   └── App.tsx             # Main application component
│   ├── public/                 # Static assets
│   └── package.json
├── screenshots/                # Application screenshots
├── test-reports/              # Generated test reports
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes with AI co-authorship when applicable
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Message Format
When using AI tools, include co-authorship:
```
git commit -m "feat: Implement sweet search functionality

Added search and filter capabilities with real-time results.
Used AI to optimize search algorithms and implement debouncing.

Co-authored-by: Claude AI <claude@anthropic.com>"
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Deployment

The application is deployed and accessible at:
- **Frontend**: [https://your-app.vercel.app](https://your-app.vercel.app)
- **Backend**: [https://your-api.herokuapp.com](https://your-api.herokuapp.com)

---

**Note**: This project was developed as part of a technical assessment, demonstrating full-stack development capabilities, testing practices, and effective AI tool usage in modern software development workflows.
