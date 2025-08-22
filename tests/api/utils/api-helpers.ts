import { APIRequestContext, expect } from '@playwright/test';

export class ApiHelpers {
  private request: APIRequestContext;
  private baseURL: string;

  constructor(request: APIRequestContext, baseURL: string = 'http://localhost:4000/api') {
    this.request = request;
    this.baseURL = baseURL;
  }

  async register(userData: any) {
    const response = await this.request.post(`${this.baseURL}/auth/register`, {
      data: userData,
    });
    
    return response;
  }

  async login(email: string, password: string) {
    const response = await this.request.post(`${this.baseURL}/auth/login`, {
      data: {
        email,
        password,
      },
    });
    
    expect(response.ok()).toBeTruthy();
    
    // Extract cookie from response
    const cookies = response.headers()['set-cookie'];
    let accessToken = '';
    
    if (cookies) {
      const tokenCookie = cookies.split(';').find(cookie => cookie.includes('access_token'));
      if (tokenCookie) {
        accessToken = tokenCookie.split('=')[1];
      }
    }
    
    return { response, accessToken, cookies };
  }

  async createAuthHeaders(cookies: string) {
    return {
      'Cookie': cookies,
      'Content-Type': 'application/json',
    };
  }

  async createProduct(cookies: string, productData: any, files?: any[]) {
    const headers = {
      'Cookie': cookies,
    };
    
    if (files && files.length > 0) {
      // For multipart form data with files
      const formData = new FormData();
      
      // Add product data
      Object.keys(productData).forEach(key => {
        if (key !== 'product_images') {
          formData.append(key, productData[key]);
        }
      });
      
      // Add files
      files.forEach((file, index) => {
        formData.append('product_images', file);
      });
      
      const response = await this.request.post(`${this.baseURL}/product/create`, {
        headers: {
          'Cookie': cookies,
        },
        multipart: formData,
      });
      
      return response;
    } else {
      // For JSON data without files
      const response = await this.request.post(`${this.baseURL}/product/create`, {
        headers,
        data: productData,
      });
      
      return response;
    }
  }

  async logout(cookies: string) {
    const headers = await this.createAuthHeaders(cookies);
    
    const response = await this.request.post(`${this.baseURL}/auth/logout`, {
      headers,
    });
    
    return response;
  }
}