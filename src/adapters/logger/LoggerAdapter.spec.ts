import { LoggerAdapter } from './LoggerAdapter';

describe('LoggerAdapter', () => {
  let consoleLogSpy: jest.SpyInstance;
  let stdoutSpy: jest.SpyInstance;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    stdoutSpy = jest.spyOn(process.stdout, 'write').mockImplementation();
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should use default values when no environment variables are set', () => {
      process.env = { ...originalEnv };
      delete process.env.APPLICATION_NAME;
      delete process.env.LOG_LEVEL;
      delete process.env.LOG_FORMAT;

      const logger = new LoggerAdapter();
      expect(logger['context']).toBe('Application');
      expect(logger['level']).toBe('INFO');
      expect(logger['json']).toBe(false);
    });

    it('should use environment variables when set', () => {
      process.env.APPLICATION_NAME = 'TestApp';
      process.env.LOG_LEVEL = 'debug';
      process.env.LOG_FORMAT = 'json';

      const logger = new LoggerAdapter();
      expect(logger['context']).toBe('TestApp');
      expect(logger['level']).toBe('debug');
      expect(logger['json']).toBe(true);
    });

    it('should use constructor parameters over environment variables', () => {
      process.env.APPLICATION_NAME = 'EnvApp';
      process.env.LOG_LEVEL = 'error';
      process.env.LOG_FORMAT = 'json';

      const logger = new LoggerAdapter('CustomApp', 'WARN', false);
      expect(logger['context']).toBe('CustomApp');
      expect(logger['level']).toBe('WARN');
      expect(logger['json']).toBe(false);
    });
  });

  describe('formatMessage', () => {
    let logger: LoggerAdapter;

    beforeEach(() => {
      logger = new LoggerAdapter('TestApp');
    });

    it('should format string message', () => {
      const result = logger['formatMessage']('INFO', 'test message', []);
      expect(result).toEqual({
        message: 'test message',
        level: 'INFO',
        context: 'TestApp',
        metadata: {}
      });
    });

    it('should format Error message with stack', () => {
      const error = new Error('test error');
      const result = logger['formatMessage']('ERROR', error, []);
      expect(result).toEqual({
        message: error,
        level: 'ERROR',
        context: 'TestApp',
        metadata: { stack: error }
      });
    });

    it('should append string and number parameters to message', () => {
      const result = logger['formatMessage']('INFO', 'base', ['extra', 42]);
      expect(result.message).toBe('base extra 42');
    });

    it('should append Date parameter to message', () => {
      const date = new Date('2023-01-01T00:00:00.000Z');
      const result = logger['formatMessage']('INFO', 'base', [date]);
      expect(result.message).toBe('base 2023-01-01T00:00:00.000Z');
    });

    it('should add Error parameter to metadata', () => {
      const error = new Error('param error');
      const result = logger['formatMessage']('INFO', 'base', [error]);
      expect(result.metadata).toEqual({ Error: error });
    });

    it('should merge object parameters into metadata', () => {
      const obj1 = { prop1: 'value1' };
      const obj2 = { prop2: 'value2' };
      const result = logger['formatMessage']('INFO', 'base', [obj1, obj2]);
      expect(result.metadata).toEqual({ prop1: 'value1', prop2: 'value2' });
    });

    it('should handle mixed parameter types', () => {
      const error = new Error('test');
      const date = new Date('2023-01-01T00:00:00.000Z');
      const obj = { key: 'value' };

      const result = logger['formatMessage']('INFO', 'base', ['string', 123, date, error, obj]);

      expect(result.message).toBe('base string 123 2023-01-01T00:00:00.000Z');
      expect(result.metadata).toEqual({
        Error: error,
        key: 'value'
      });
    });
  });

  describe('isEnabled', () => {
    it('should return false when level is not found', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const logger = new LoggerAdapter('test', 'INVALID' as any);
      const result = logger['isEnabled']('INFO');
      expect(result).toBe(false);
    });

    it('should return true when current level is equal to enabled level', () => {
      const logger = new LoggerAdapter('test', 'INFO');
      logger['levels'] = { 'INFO': 'info', 'WARN': 'warn', 'ERROR': 'error' };

      const result = logger['isEnabled']('INFO');
      expect(result).toBe(true);
    });

    it('should return true when current level is higher than enabled level', () => {
      const logger = new LoggerAdapter('test', 'INFO');
      logger['levels'] = { 'DEBUG': 'debug', 'INFO': 'info', 'WARN': 'warn', 'ERROR': 'error' };

      const result = logger['isEnabled']('ERROR');
      expect(result).toBe(true);
    });

    it('should return false when current level is lower than enabled level', () => {
      const logger = new LoggerAdapter('test', 'WARN');
      logger['levels'] = { 'DEBUG': 'debug', 'INFO': 'info', 'WARN': 'warn', 'ERROR': 'error' };

      const result = logger['isEnabled']('INFO');
      expect(result).toBe(false);
    });
  });

  describe('doprint', () => {
    it('should print JSON format when json is true', () => {
      const logger = new LoggerAdapter('test', 'INFO', true);
      const data = logger['formatMessage']('INFO', 'test', []);

      logger['doprint'](data);
      expect(consoleLogSpy).toHaveBeenCalledWith(JSON.stringify(data));
    });

    it('should print colored format when json is false', () => {
      process.env.APPLICATION_NAME = 'TestApp';
      process.env.NODE_ENV = 'test';

      const logger = new LoggerAdapter('test', 'INFO', false);
      logger['levels'] = { 'INFO': 'info' };
      const data = logger['formatMessage']('INFO', 'test message', []);

      logger['doprint'](data);
      expect(stdoutSpy).toHaveBeenCalled();
    });

    it('should include metadata for DEBUG level', () => {
      process.env.APPLICATION_NAME = 'TestApp';
      process.env.NODE_ENV = 'test';

      const logger = new LoggerAdapter('test', 'DEBUG', false);
      logger['levels'] = { 'DEBUG': 'debug' };
      const data = logger['formatMessage']('DEBUG', 'debug message', [{ key: 'value' }]);

      logger['doprint'](data);
      expect(stdoutSpy).toHaveBeenCalled();
    });

    it('should include metadata for CRITICAL level', () => {
      process.env.APPLICATION_NAME = 'TestApp';
      process.env.NODE_ENV = 'test';

      const logger = new LoggerAdapter('test', 'CRITICAL', false);
      logger['levels'] = { 'CRITICAL': 'critical' };
      const data = logger['formatMessage']('CRITICAL', 'critical message', [{ error: 'details' }]);

      logger['doprint'](data);
      expect(stdoutSpy).toHaveBeenCalled();
    });

    it('should not include metadata for other levels even when present', () => {
      process.env.APPLICATION_NAME = 'TestApp';
      process.env.NODE_ENV = 'test';

      const logger = new LoggerAdapter('test', 'INFO', false);
      logger['levels'] = { 'INFO': 'info' };
      const data = logger['formatMessage']('INFO', 'info message', [{ key: 'value' }]);

      logger['doprint'](data);
      expect(stdoutSpy).toHaveBeenCalled();
    });
  });

  describe('colorfully', () => {
    let logger: LoggerAdapter;

    beforeEach(() => {
      logger = new LoggerAdapter();
    });

    it('should replace color tags with ANSI codes', () => {
      const text = '<RED>error<RESET> normal <BLUE>info';
      logger.colorfully(text);
      expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringContaining('\u001B[31merror\u001B[0m normal \u001B[34minfo')
      );
    });

    it('should handle all color codes', () => {
      const text = '<BLACK><RED><GREEN><YELLOW><BLUE><MAGENTA><CYAN><GREY><ERROR><INFO><WARN><HTTP><DEBUG><ALERT><WHITE>test';
      logger.colorfully(text);
      expect(stdoutSpy).toHaveBeenCalled();
    });

    it('should colorize curly braces', () => {
      const text = 'object {key: value}';
      logger.colorfully(text);
      expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringContaining('\u001B[97m{\u001B[0m')
      );
    });

    it('should end with reset code and newline', () => {
      logger.colorfully('test');
      const calls = stdoutSpy.mock.calls;
      const lastCall = calls[calls.length - 1][0];
      expect(lastCall).toContain('\u001B[0m\n');
    });

    it('should handle case insensitive color tags', () => {
      const text = '<red>error<RESET>';
      logger.colorfully(text);
      expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringContaining('\u001B[31merror\u001B[0m')
      );
    });
  });
});