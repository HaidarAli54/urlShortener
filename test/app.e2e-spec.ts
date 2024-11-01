import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module'; 
import { AuthService } from '../src/auth/auth.service'; // Ganti dengan path yang sesuai
import { UrlService } from '../src/url/url.service'; // Ganti dengan path yang sesuai

describe('URL Shortener E2E Tests', () => {
  let app: INestApplication;
  let accessToken: string;
  let shortUrl: string; 
  let authService: AuthService;
  let urlService: UrlService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    authService = moduleFixture.get<AuthService>(AuthService); // Mengambil instance authService yang dibuat di AppModule = moduleFixture.get<AuthService>(AuthService);
    urlService = moduleFixture.get<UrlService>(UrlService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Reset nilai untuk setiap pengujian
    accessToken = '';
    shortUrl = '';
  });

  afterEach(async () => {
    // Pembersihan setelah setiap pengujian
    if (shortUrl && accessToken) {
      await urlService.deleteShortUrl(shortUrl, accessToken); // Pastikan untuk memberikan token
    }

    const user = await authService.findUserByEmail('admin9@mail.com');  
    if (user) {
      await authService.deleteUser (user.id.toString())
    };

  });

  it('should register a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: 'admin11',
        email: 'admin11@mail.com',
        password: 'admin11',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe('admin11');
    expect(response.body.email).toBe('admin11@mail.com');
  });

  it('should log in a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin11@mail.com',
        password: 'admin11',
      })
      .expect(201);

    expect(response.body).toHaveProperty('accessToken');
    accessToken = response.body.accessToken;
  });

  it('should shorten a URL', async () => {
    const response = await request(app.getHttpServer())
      .post('/url/shorten')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        originalUrl: 'www.example.com',
      })
      .expect(201);

    expect(response.body).toHaveProperty('shortUrl');
    shortUrl = response.body.shortUrl; 
    console.log('Shortened URL:', shortUrl);
  });

  it('should access the shortened URL', async () => {
    const response = await request(app.getHttpServer())
      .get(`/url/${shortUrl}`)
      .expect(302); 
      
    expect(response.header.location).toBe('www.example.com'); 
  });
});