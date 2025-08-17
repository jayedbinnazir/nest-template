import { test, expect } from '@playwright/test';
import { ApiHelpers } from '../utils/api-helpers';

test.describe('Authentication API Tests', () => {
  let apiHelpers: ApiHelpers;

  test.beforeEach(async ({ request }) => {
    apiHelpers = new ApiHelpers(request);
  });

  test('should register a new user successfully', async ({ request }) => {
    const userData = {
      email: `test${Date.now()}@example.com`,
      password: 'TestPassword123!',
      first_name: 'Test',
      last_name: 'User',
      // Add other required fields based on your CreateAuthDto
    };

    const response = await apiHelpers.register(userData);
    
    expect(response.status()).toBe(201);
    
    const data = await response.json();
    expect(data).toHaveProperty('access_token');
    
    // Check if cookie is set
    const cookies = response.headers()['set-cookie'];
    expect(cookies).toContain('access_token');
  });

  test('should login with valid credentials', async ({ request }) => {
    // First register a user
    const userData = {
      email: `login${Date.now()}@example.com`,
      password: 'TestPassword123!',
      first_name: 'Login',
      last_name: 'Test',
    };

    await apiHelpers.register(userData);

    // Then login
    const { response, accessToken, cookies } = await apiHelpers.login(userData.email, userData.password);

    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('access_token');
    
    // Check if cookie is set
    expect(cookies).toContain('access_token');
  });

  test('should reject login with invalid credentials', async ({ request }) => {
    const response = await request.post('/auth/login', {
      data: {
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      },
    });

    expect(response.status()).toBe(401);
  });

  test('should logout successfully', async ({ request }) => {
    // Register and login first
    const userData = {
      email: `logout${Date.now()}@example.com`,
      password: 'TestPassword123!',
      first_name: 'Logout',
      last_name: 'Test',
    };

    await apiHelpers.register(userData);
    const { cookies } = await apiHelpers.login(userData.email, userData.password);

    // Logout
    const response = await apiHelpers.logout(cookies);
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.message).toBe('Logged out successfully');
  });
});