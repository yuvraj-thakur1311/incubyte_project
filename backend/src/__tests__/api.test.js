"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const app_1 = __importDefault(require("../app"));
const User_1 = __importDefault(require("../models/User"));
const Sweet_1 = __importDefault(require("../models/Sweet"));
// Global test setup'
jest.setTimeout(30000);
let mongod;
beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
    mongod = await mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongod.getUri();
    process.env.MONGO_URI = uri;
    await mongoose_1.default.connect(uri);
}, 30000);
afterEach(async () => {
    const collections = mongoose_1.default.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        if (collection) {
            await collection.deleteMany({});
        }
    }
}, 30000);
afterAll(async () => {
    await mongoose_1.default.connection.dropDatabase();
    await mongoose_1.default.connection.close();
    await mongod.stop();
}, 30000);
// Helper functions
const createUser = async (role = 'user') => {
    const hashedPassword = await bcryptjs_1.default.hash('password123', 10);
    const userData = {
        username: role === 'admin' ? 'admin' : 'testuser',
        email: role === 'admin' ? 'admin@example.com' : 'user@example.com',
        password: hashedPassword,
        role
    };
    const user = await User_1.default.create(userData);
    const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { user, token };
};
const createSweet = async () => {
    return await Sweet_1.default.create({
        name: 'Test Sweet',
        category: 'chocolate',
        price: 10.99,
        quantity: 50
    });
};
// ===========================================
// AUTHENTICATION TESTS
// ===========================================
describe('Authentication Tests', () => {
    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
                role: 'user'
            };
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/register')
                .send(userData)
                .expect(201);
            expect(response.body).toHaveProperty('userId');
            expect(response.body).toHaveProperty('token');
            expect(response.body.username).toBe(userData.username);
            expect(response.body.email).toBe(userData.email);
            expect(response.body.role).toBe(userData.role);
            expect(response.body).not.toHaveProperty('password');
        });
        it('should fail with missing required fields', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/register')
                .send({ username: 'testuser' })
                .expect(400);
            expect(response.body.error).toBe('Please fill all required fields.');
        });
        it('should fail with duplicate email', async () => {
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            };
            await (0, supertest_1.default)(app_1.default).post('/api/auth/register').send(userData).expect(201);
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/register')
                .send({ ...userData, username: 'different' })
                .expect(400);
            expect(response.body.error).toBe('User already exists with this email.');
        });
        it('should default role to "user"', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/register')
                .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            })
                .expect(201);
            expect(response.body.role).toBe('user');
        });
    });
    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            await createUser('user');
        });
        it('should login successfully with correct credentials', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/login')
                .send({
                email: 'user@example.com',
                password: 'password123'
            })
                .expect(200);
            expect(response.body).toHaveProperty('userId');
            expect(response.body).toHaveProperty('token');
            expect(response.body.username).toBe('testuser');
            expect(response.body.email).toBe('user@example.com');
        });
        it('should fail with missing credentials', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/login')
                .send({ email: 'user@example.com' })
                .expect(400);
            expect(response.body.error).toBe('Please fill all required fields.');
        });
        it('should fail with invalid email', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/login')
                .send({
                email: 'nonexistent@example.com',
                password: 'password123'
            })
                .expect(400);
            expect(response.body.error).toBe('Invalid email or password.');
        });
        it('should fail with incorrect password', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/login')
                .send({
                email: 'user@example.com',
                password: 'wrongpassword'
            })
                .expect(400);
            expect(response.body.error).toBe('Invalid email or password.');
        });
    });
});
// ===========================================
// SWEET MANAGEMENT TESTS
// ===========================================
describe('Sweet Management Tests', () => {
    let adminToken;
    let userToken;
    beforeEach(async () => {
        const admin = await createUser('admin');
        const user = await createUser('user');
        adminToken = admin.token;
        userToken = user.token;
    }, 30000);
    describe('POST /api/sweets', () => {
        it('should add a new sweet as admin', async () => {
            const sweetData = {
                name: 'New Sweet',
                category: 'candy',
                price: 5.99,
                quantity: 100
            };
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(sweetData)
                .expect(201);
            expect(response.body.name).toBe(sweetData.name);
            expect(response.body.category).toBe(sweetData.category);
            expect(response.body.price).toBe(sweetData.price);
            expect(response.body.quantity).toBe(sweetData.quantity);
        });
        it('should fail to add sweet as regular user', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                name: 'New Sweet',
                category: 'candy',
                price: 5.99,
                quantity: 100
            })
                .expect(403);
            expect(response.body.error).toBe('Forbidden: Admins only.');
        });
        it('should fail to add duplicate sweet', async () => {
            const sweetData = {
                name: 'Test Sweet',
                category: 'candy',
                price: 5.99,
                quantity: 100
            };
            await (0, supertest_1.default)(app_1.default)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(sweetData)
                .expect(201);
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(sweetData)
                .expect(400);
            expect(response.body.error).toBe('Sweet already exists');
        });
    });
    describe('GET /api/sweets', () => {
        beforeEach(async () => {
            await createSweet();
        }, 30000);
        it('should get all sweets', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .get('/api/sweets')
                .expect(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0].name).toBe('Test Sweet');
        });
    });
    describe('GET /api/sweets/search', () => {
        beforeEach(async () => {
            await Sweet_1.default.create([
                { name: 'Chocolate Bar', category: 'chocolate', price: 3.99, quantity: 20 },
                { name: 'Gummy Bears', category: 'gummy', price: 2.99, quantity: 30 },
                { name: 'Dark Chocolate', category: 'chocolate', price: 4.99, quantity: 15 }
            ]);
        }, 30000);
        it('should search sweets by name', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .get('/api/sweets/search?name=chocolate')
                .expect(200);
            expect(response.body.length).toBe(2);
            response.body.forEach((sweet) => {
                expect(sweet.name.toLowerCase()).toContain('chocolate');
            });
        });
        it('should search sweets by category', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .get('/api/sweets/search?category=chocolate')
                .expect(200);
            expect(response.body.length).toBe(2);
            response.body.forEach((sweet) => {
                expect(sweet.category).toBe('chocolate');
            });
        });
        it('should return empty array for non-matching search', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .get('/api/sweets/search?name=nonexistent')
                .expect(200);
            expect(response.body.length).toBe(0);
        });
    });
    describe('PUT /api/sweets/:id', () => {
        let testSweet;
        beforeEach(async () => {
            testSweet = await createSweet();
        }, 30000);
        it('should update sweet as admin', async () => {
            const updates = {
                name: 'Updated Sweet',
                price: 15.99
            };
            const response = await (0, supertest_1.default)(app_1.default)
                .put(`/api/sweets/${testSweet._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updates)
                .expect(200);
            expect(response.body.name).toBe(updates.name);
            expect(response.body.price).toBe(updates.price);
        });
        it('should fail to update non-existent sweet', async () => {
            const fakeId = '507f1f77bcf86cd799439011';
            const response = await (0, supertest_1.default)(app_1.default)
                .put(`/api/sweets/${fakeId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'Updated' })
                .expect(404);
            expect(response.body.error).toBe('Sweet not found');
        });
    });
    describe('DELETE /api/sweets/:id', () => {
        let testSweet;
        beforeEach(async () => {
            testSweet = await createSweet();
        }, 30000);
        it('should delete sweet as admin', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .delete(`/api/sweets/${testSweet._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
            expect(response.body.message).toBe('Sweet deleted successfully');
            const deletedSweet = await Sweet_1.default.findById(testSweet._id);
            expect(deletedSweet).toBeNull();
        });
        it('should fail to delete with invalid ID', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .delete('/api/sweets/invalid-id')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(400);
            expect(response.body.error).toBe('Invalid sweet ID');
        });
        it('should fail to delete non-existent sweet', async () => {
            const fakeId = '507f1f77bcf86cd799439011';
            const response = await (0, supertest_1.default)(app_1.default)
                .delete(`/api/sweets/${fakeId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(404);
            expect(response.body.error).toBe('Sweet not found');
        });
    });
});
// ===========================================
// INVENTORY MANAGEMENT TESTS
// ===========================================
describe('Inventory Management Tests', () => {
    let adminToken;
    let userToken;
    let testSweet;
    beforeEach(async () => {
        const admin = await createUser('admin');
        const user = await createUser('user');
        adminToken = admin.token;
        userToken = user.token;
        testSweet = await createSweet();
    }, 30000);
    describe('POST /api/sweets/:id/purchase', () => {
        it('should purchase sweet successfully', async () => {
            const purchaseQuantity = 5;
            const initialQuantity = testSweet.quantity;
            const response = await (0, supertest_1.default)(app_1.default)
                .post(`/api/sweets/${testSweet._id}/purchase`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ quantity: purchaseQuantity })
                .expect(200);
            expect(response.body.message).toBe(`Purchased ${purchaseQuantity} ${testSweet.name}(s)`);
            expect(response.body.sweet.quantity).toBe(initialQuantity - purchaseQuantity);
        });
        it('should purchase with default quantity of 1', async () => {
            const initialQuantity = testSweet.quantity;
            const response = await (0, supertest_1.default)(app_1.default)
                .post(`/api/sweets/${testSweet._id}/purchase`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({})
                .expect(200);
            expect(response.body.sweet.quantity).toBe(initialQuantity - 1);
        });
        it('should fail purchase when insufficient quantity', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post(`/api/sweets/${testSweet._id}/purchase`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ quantity: 100 })
                .expect(400);
            expect(response.body.error).toBe('Insufficient quantity in stock');
        });
        it('should fail purchase for non-existent sweet', async () => {
            const fakeId = '507f1f77bcf86cd799439011';
            const response = await (0, supertest_1.default)(app_1.default)
                .post(`/api/sweets/${fakeId}/purchase`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ quantity: 1 })
                .expect(404);
            expect(response.body.error).toBe('Sweet not found');
        });
        it('should require authentication', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post(`/api/sweets/${testSweet._id}/purchase`)
                .send({ quantity: 1 })
                .expect(401);
            expect(response.body.error).toBe('No token provided');
        });
    });
    it('should handle multiple operations correctly', async () => {
        const initialQuantity = testSweet.quantity; // 50
        // Purchase 10 items
        await (0, supertest_1.default)(app_1.default)
            .post(`/api/sweets/${testSweet._id}/purchase`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ quantity: 10 })
            .expect(200);
        // Restock 30 items
        await (0, supertest_1.default)(app_1.default)
            .post(`/api/sweets/${testSweet._id}/restock`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ quantity: 30 })
            .expect(200);
        // Verify final quantity
        const updatedSweet = await Sweet_1.default.findById(testSweet._id);
        expect(updatedSweet?.quantity).toBe(initialQuantity - 10 + 30); // 70
    });
});
// ===========================================
// MIDDLEWARE TESTS
// ===========================================
describe('Middleware Tests', () => {
    describe('Authentication', () => {
        it('should allow access with valid token', async () => {
            const { token } = await createUser('user');
            const response = await (0, supertest_1.default)(app_1.default)
                .get('/api/protected')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
            expect(response.body.message).toBe('This is a protected route');
            expect(response.body.userId).toBeDefined();
        });
        it('should reject request without token', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .get('/api/protected')
                .expect(401);
            expect(response.body.error).toBe('No token provided');
        });
        it('should reject invalid token format', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .get('/api/protected')
                .set('Authorization', 'InvalidFormat token')
                .expect(401);
            expect(response.body.error).toBe('No token provided');
        });
        it('should reject invalid JWT token', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .get('/api/protected')
                .set('Authorization', 'Bearer invalid.jwt.token')
                .expect(401);
            expect(response.body.error).toBe('Invalid token');
        });
    });
    describe('Authorization', () => {
        it('should allow admin access to admin routes', async () => {
            const { token } = await createUser('admin');
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${token}`)
                .send({
                name: 'Test Sweet',
                category: 'candy',
                price: 5.99,
                quantity: 100
            })
                .expect(201);
            expect(response.body.name).toBe('Test Sweet');
        });
        it('should reject regular user from admin routes', async () => {
            const { token } = await createUser('user');
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${token}`)
                .send({
                name: 'Test Sweet',
                category: 'candy',
                price: 5.99,
                quantity: 100
            })
                .expect(403);
            expect(response.body.error).toBe('Forbidden: Admins only.');
        });
    });
});
// ===========================================
// INTEGRATION TESTS
// ===========================================
describe('Integration Tests', () => {
    it('should handle complete user flow', async () => {
        // 1. Register admin user
        const adminRegisterResponse = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/register')
            .send({
            username: 'admin',
            email: 'admin@example.com',
            password: 'adminpassword',
            role: 'admin'
        })
            .expect(201);
        const adminToken = adminRegisterResponse.body.token;
        // 2. Register regular user
        const userRegisterResponse = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/register')
            .send({
            username: 'user',
            email: 'user@example.com',
            password: 'userpassword'
        })
            .expect(201);
        const userToken = userRegisterResponse.body.token;
        // 3. Admin adds a sweet
        const addSweetResponse = await (0, supertest_1.default)(app_1.default)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
            name: 'Chocolate Bar',
            category: 'chocolate',
            price: 3.99,
            quantity: 100
        })
            .expect(201);
        const sweetId = addSweetResponse.body._id;
        // 4. User searches for sweets
        const searchResponse = await (0, supertest_1.default)(app_1.default)
            .get('/api/sweets/search?category=chocolate')
            .expect(200);
        expect(searchResponse.body.length).toBeGreaterThan(0);
        // 5. User purchases sweet
        await (0, supertest_1.default)(app_1.default)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ quantity: 5 })
            .expect(200);
        // 6. Admin restocks sweet
        await (0, supertest_1.default)(app_1.default)
            .post(`/api/sweets/${sweetId}/restock`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ quantity: 20 })
            .expect(200);
        // 7. Admin updates sweet
        const updateResponse = await (0, supertest_1.default)(app_1.default)
            .put(`/api/sweets/${sweetId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ price: 4.99 })
            .expect(200);
        expect(updateResponse.body.price).toBe(4.99);
        // 8. Verify final state
        const finalSweetsResponse = await (0, supertest_1.default)(app_1.default)
            .get('/api/sweets')
            .expect(200);
        const updatedSweet = finalSweetsResponse.body.find((s) => s._id === sweetId);
        expect(updatedSweet.quantity).toBe(115); // 100 - 5 + 20
        expect(updatedSweet.price).toBe(4.99);
    });
    it('should handle health check', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get('/')
            .expect(200);
        expect(response.text).toBe('Sweet Shop Management API is running');
    });
    it('should handle 404 for non-existent routes', async () => {
        await (0, supertest_1.default)(app_1.default)
            .get('/api/nonexistent')
            .expect(404);
    });
    it('should handle CORS', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .options('/api/auth/register')
            .expect(204);
        expect(response.headers['access-control-allow-origin']).toBe('https://incubyte-project-847thmnf4.vercel.app/');
    });
});
