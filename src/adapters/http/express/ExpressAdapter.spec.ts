import { ExpressRouteHandler } from '@/adapters/http/express/ExpressRouteHandler';
import { Router } from 'express';
import request from 'supertest';
import { ExpressAdapter } from './ExpressAdapter';

// Mock apenas os serviços necessários
jest.mock('@/application/services/logger/LoggerService', () => ({
  LoggerService: jest.fn().mockImplementation(() => ({
    http: jest.fn(),
    info: jest.fn(),
    verbose: jest.fn(),
    debug: jest.fn(),
    critical: jest.fn()
  }))
}));

// Helper para criar router de teste
const createTestRouter = (path = '/test') => ({
  router: (() => {
    const router = Router();
    router.get(path, (req, res) => res.json({ message: 'test route' }));
    router.post(path, (req, res) => res.status(201).json({ message: 'created', data: req.body }));
    return router;
  })()
});

describe('ExpressAdapter', () => {
  let adapter: ExpressAdapter;

  beforeEach(() => {
    adapter = new ExpressAdapter();
  });

  describe('core functionality', () => {
    it('should initialize and handle prefix configuration', () => {
      expect(adapter).toBeDefined();
      expect(adapter['app']).toBeDefined();

      const result = adapter.setPrefix('/api/v1');
      expect(result).toBe(adapter);
      expect(adapter['prefix']).toBe('/api/v1');

      adapter.setPrefix('api');
      expect(adapter['prefix']).toBe('/api');

      adapter.setPrefix('');
      expect(adapter['prefix']).toBe('/');
    });

    it('should add global middleware and support method chaining', async () => {
      const middleware = jest.fn((req, res, next) => {
        req.customProp = 'test';
        next();
      });

      const result = adapter
        .useMiddleware(middleware)
        .setPrefix('/api')
        .registerFactory(() => createTestRouter());

      expect(result).toBe(adapter);

      const response = await request(adapter['app'])
        .get('/api/test')
        .expect(200);

      expect(middleware).toHaveBeenCalled();
      expect(response.body).toEqual({ message: 'test route' });
    });

    it('should register router factories and handle routes', async () => {
      adapter.setPrefix('/api').registerFactory(() => createTestRouter());

      const getResponse = await request(adapter['app'])
        .get('/api/test')
        .expect(200);
      expect(getResponse.body).toEqual({ message: 'test route' });

      const postData = { name: 'test' };
      const postResponse = await request(adapter['app'])
        .post('/api/test')
        .send(postData)
        .expect(201);
      expect(postResponse.body).toEqual({ message: 'created', data: postData });
    });

    it('should handle multiple routers and work without prefix', async () => {
      const secondRouter = {
        router: (() => {
          const router = Router();
          router.get('/second', (req, res) => res.json({ message: 'second route' }));
          return router;
        })()
      };

      adapter
        .setPrefix('/api')
        .registerFactory(() => createTestRouter())
        .registerFactory(() => secondRouter);

      await request(adapter['app']).get('/api/test').expect(200);
      await request(adapter['app']).get('/api/second').expect(200);

      const adapterNoPrefix = new ExpressAdapter();
      adapterNoPrefix.registerFactory(() => createTestRouter());
      const response = await request(adapterNoPrefix['app']).get('/test').expect(200);
      expect(response.body).toEqual({ message: 'test route' });
    });

    it('should use router with middleware handlers', async () => {
      const middleware1 = jest.fn((req, res, next) => {
        req.custom1 = 'value1';
        next();
      });

      const middleware2 = jest.fn((req, res, next) => {
        req.custom2 = 'value2';
        next();
      });

      const testHandler = jest.fn((req, res) => {
        res.json({
          custom1: req.custom1,
          custom2: req.custom2,
          message: 'useRouter test'
        });
      });

      adapter
        .setPrefix('/api')
        .useRouter(middleware1, middleware2, testHandler);

      const response = await request(adapter['app'])
        .get('/api/anything')
        .expect(200);

      expect(middleware1).toHaveBeenCalled();
      expect(middleware2).toHaveBeenCalled();
      expect(testHandler).toHaveBeenCalled();
      expect(response.body).toEqual({
        custom1: 'value1',
        custom2: 'value2',
        message: 'useRouter test'
      });
    });
  });

  describe('server lifecycle', () => {
    it('should start server and return adapter instance', () => {
      const mockCallback = jest.fn();
      const mockListen = jest.fn((port, callback) => {
        if (callback) callback();
        return { close: jest.fn() };
      });

      (adapter['app'] as unknown as { listen: jest.Mock }).listen = mockListen;

      const result = adapter.start(3001, mockCallback);

      expect(result).toBe(adapter);
      expect(mockListen).toHaveBeenCalledWith(3001, expect.any(Function));
      expect(mockCallback).toHaveBeenCalled();
    });

    it('should handle start errors', () => {
      const mockListen = jest.fn().mockImplementation(() => {
        throw new Error('Port binding failed');
      });

      (adapter['app'] as unknown as { listen: jest.Mock }).listen = mockListen;

      const result = adapter.start(8080);
      expect(result).toBe(adapter);
    });

    it('should handle callback errors in listen', () => {
      const mockListen = jest.fn((port, callback) => {
        if (callback) {
          callback(new Error('Callback error'));
        }
        return { close: jest.fn() };
      });

      (adapter['app'] as unknown as { listen: jest.Mock }).listen = mockListen;

      const result = adapter.start(3000);
      expect(result).toBe(adapter);
      expect(mockListen).toHaveBeenCalledWith(3000, expect.any(Function));
    });
  });

  describe('route logging', () => {
    it('should log routes correctly', () => {
      const mockStack = [
        { route: { path: '/test', methods: { get: true } }, name: 'handle' },
        { route: {}, name: 'handle' }
      ] as unknown as Router['stack'];

      adapter.setPrefix('/api');

      expect(() => adapter.printLayers(mockStack)).not.toThrow();
    });
  });

  describe('express integration', () => {
    it('should handle HTTP features correctly', async () => {
      const featureRouter = {
        router: (() => {
          const router = Router();
          router.get('/query', (req, res) => res.json({ query: req.query }));
          router.get('/params/:id', (req, res) => res.json({ id: req.params.id }));
          router.post('/form', (req, res) => res.json({ received: req.body }));
          return router;
        })()
      };

      adapter.setPrefix('/api').registerFactory(() => featureRouter);

      const queryResponse = await request(adapter['app'])
        .get('/api/query?name=test&page=1')
        .expect(200);
      expect(queryResponse.body.query).toEqual({ name: 'test', page: '1' });

      const paramResponse = await request(adapter['app'])
        .get('/api/params/123')
        .expect(200);
      expect(paramResponse.body).toEqual({ id: '123' });

      const jsonData = { name: 'test', value: 123 };
      const jsonResponse = await request(adapter['app'])
        .post('/api/form')
        .send(jsonData)
        .expect(200);
      expect(jsonResponse.body.received).toEqual(jsonData);
    });
  });

  describe('error handling', () => {
    it('should handle factory errors', () => {
      const badFactory = () => {
        throw new Error('Factory error');
      };

      expect(() => adapter.registerFactory(badFactory)).toThrow('Factory error');
    });
  });
});

describe('ExpressRouteHandler', () => {
  let handler: { register: (router: unknown) => unknown };
  let mockReq: Record<string, unknown>;
  let mockRes: { status: jest.Mock; json: jest.Mock };
  let mockNext: jest.Mock;

  beforeEach(async () => {
    handler = new ExpressRouteHandler();

    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('register method', () => {
    it('should handle successful router execution', async () => {
      const mockRouter = jest.fn().mockResolvedValue({ data: 'success' });
      const middleware = handler.register(mockRouter) as (req: unknown, res: unknown, next: unknown) => Promise<void>;

      await middleware(mockReq, mockRes, mockNext);

      expect(mockRouter).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ data: 'success' });
    });

    it('should handle ValidationError', async () => {
      const error = new Error('Validation failed');
      error.name = 'ValidationError';
      const mockRouter = jest.fn().mockRejectedValue(error);
      const middleware = handler.register(mockRouter) as (req: unknown, res: unknown, next: unknown) => Promise<void>;

      await middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Validation failed' });
    });

    it('should handle NotFoundError', async () => {
      const error = new Error('Resource not found');
      error.name = 'NotFoundError';
      const mockRouter = jest.fn().mockRejectedValue(error);
      const middleware = handler.register(mockRouter) as (req: unknown, res: unknown, next: unknown) => Promise<void>;

      await middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Resource not found' });
    });

    it('should handle generic errors', async () => {
      const error = new Error('Something went wrong');
      const mockRouter = jest.fn().mockRejectedValue(error);
      const middleware = handler.register(mockRouter) as (req: unknown, res: unknown, next: unknown) => Promise<void>;

      await middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });
});