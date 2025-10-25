import 'zod';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APPLICATION_NAME?: string;
      NODE_ENV: 'development' | 'staging' | 'production' | 'test';
      DATABASE_URL: string;
      LOG_LEVEL?: 'debug' | 'info' | 'warn' | 'error';
      LOG_FORMAT?: 'json' | string;
      PORT?: string;
    }
  }
}


// Declare a global augmentation for Zod's GlobalMeta interface (optional, but good practice for custom metadata)
declare module 'zod' {
  interface GlobalMeta {
    name?: string;
    statusCode?: number
  }
}

export { };
