declare namespace NodeJS {
    interface Process {
      env: {
        NODE_ENV: 'development' | 'production';
        // Add any other environment variables you use here
      };
      // Add any other properties and methods you use from the process object here
    }
  }
  