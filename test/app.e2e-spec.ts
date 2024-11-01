import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module'; 
import { AuthService } from '../src/auth/auth.service'; 
import { UrlService } from '../src/url/url.service'; 

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
    authService = moduleFixture.get<AuthService>(AuthService); 
    urlService = moduleFixture.get<UrlService>(UrlService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {

    accessToken = '';
    shortUrl = '';
  });

  afterEach(async () => {
    if (shortUrl && accessToken) {
      await urlService.deleteShortUrl(shortUrl, accessToken); 
    }

    const user = await authService.findUserByEmail('aliaja@mail.com');  
    if (user) {
      await authService.deleteUser (user.id.toString())
    };

  });

  it('should register a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: 'aliaja',
        email: 'aliaja@mail.com',
        password: 'aliaja',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe('aliaja');
    expect(response.body.email).toBe('aliaja@mail.com');
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
    const loginResponse = await request(app.getHttpServer())

    .post('/auth/login')
    .send({
      email: 'admin11@mail.com',
      password: 'admin11',

    })

    .expect(201); 


  expect(loginResponse.body).toHaveProperty('accessToken');

  accessToken = loginResponse.body.accessToken; 


  expect(accessToken).toBeDefined(); 


  const response = await request(app.getHttpServer())

    .post('/url/shorten')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      originalUrl: 'http://www.example.com',
    })
    .expect(201); 

  expect(response.body).toHaveProperty('shortUrl');
  });

  it('should access the shortened URL', async () => {
    if (!shortUrl) {
      console.error('Short URL is not set');
      return;

    }
    const response = await request(app.getHttpServer())
      .get(`/url/${shortUrl}`)
      .expect(302); 
      
    expect(response.header.location).toBe('http://www.example.com'); 
  });
});