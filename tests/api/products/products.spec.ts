import { test, expect } from '@playwright/test';
import { ApiHelpers } from '../utils/api-helpers';

test.describe('Product API Tests', () => {
  let apiHelpers: ApiHelpers;
  let authCookies: string;

  test.beforeEach(async ({ request }) => {
    apiHelpers = new ApiHelpers(request);
    
    // Setup: Create user and get auth cookies
    const userData = {
      email: `product${Date.now()}@example.com`,
      password: 'TestPassword123!',
      first_name: 'Product',
      last_name: 'Tester',
    };

    await apiHelpers.register(userData);
    const { cookies } = await apiHelpers.login(userData.email, userData.password);
    authCookies = cookies;
  });

  test('should create a new product without images', async ({ request }) => {
    const productData = {
      name: 'Test Product',
      description: 'A test product description',
      price: 99.99,
      category: 'Electronics',
      // Add other required fields based on your CreateProductDto
    };

    const response = await apiHelpers.createProduct(authCookies, productData);
    
    expect(response.status()).toBe(201);
    
    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data.name).toBe(productData.name);
    expect(data.price).toBe(productData.price);
  });

  test('should get all products with query parameters', async ({ request }) => {
    // First create a product
    const productData = {
      name: 'Get All Test Product',
      description: 'Product for get all test',
      price: 149.99,
      category: 'Test Category',
    };

    await apiHelpers.createProduct(authCookies, productData);

    // Get all products with query params
    const response = await request.get('/product/get-all?page=1&limit=10');
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data) || data.hasOwnProperty('data')).toBeTruthy();
  });

  test('should get product by ID', async ({ request }) => {
    // Create a product first
    const productData = {
      name: 'Get By ID Product',
      description: 'Product for get by ID test',
      price: 199.99,
      category: 'Test',
    };

    const createResponse = await apiHelpers.createProduct(authCookies, productData);
    const createdProduct = await createResponse.json();

    // Get product by ID
    const response = await request.get(`/product/${createdProduct.id}`);
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.id).toBe(createdProduct.id);
    expect(data.name).toBe(productData.name);
  });

  test('should soft delete a product', async ({ request }) => {
    // Create a product first
    const productData = {
      name: 'Soft Delete Test Product',
      description: 'Product to be soft deleted',
      price: 99.99,
      category: 'Temporary',
    };

    const createResponse = await apiHelpers.createProduct(authCookies, productData);
    const createdProduct = await createResponse.json();

    // Soft delete the product
    const headers = await apiHelpers.createAuthHeaders(authCookies);
    const response = await request.delete(`/product/softRemove/${createdProduct.id}`, {
      headers,
    });

    expect(response.status()).toBe(200);
  });

  test('should hard delete a product', async ({ request }) => {
    // Create a product first
    const productData = {
      name: 'Hard Delete Test Product',
      description: 'Product to be hard deleted',
      price: 99.99,
      category: 'Temporary',
    };

    const createResponse = await apiHelpers.createProduct(authCookies, productData);
    const createdProduct = await createResponse.json();

    // Hard delete the product
    const headers = await apiHelpers.createAuthHeaders(authCookies);
    const response = await request.delete(`/product/hard/${createdProduct.id}`, {
      headers,
    });

    expect(response.status()).toBe(200);
  });

  test('should reject product creation without authentication', async ({ request }) => {
    const productData = {
      name: 'Unauthorized Product',
      description: 'This should fail',
      price: 99.99,
      category: 'Fail',
    };

    const response = await request.post('/product/create', {
      data: productData,
    });

    expect(response.status()).toBe(401);
  });
});