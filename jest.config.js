module.exports = {
  projects: [
    {
      displayName: 'Frontend',
      testMatch: ['<rootDir>/sweet-frontend/**/*.{test,spec}.{js,jsx,ts,tsx}'],
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
      moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(gif|ttf|eot|svg|png|jpg|jpeg)$': 'jest-transform-stub'
      },
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {
          presets: [
            ['@babel/preset-env', { targets: { node: 'current' } }],
            ['@babel/preset-react', { runtime: 'automatic' }],
            '@babel/preset-typescript'
          ]
        }]
      },
      collectCoverageFrom: [
        'sweet-frontend/src/**/*.{js,jsx,ts,tsx}',
        '!sweet-frontend/src/**/*.d.ts',
        '!sweet-frontend/src/main.tsx',
        '!sweet-frontend/src/vite-env.d.ts'
      ]
    },
    {
      displayName: 'Backend',
      testMatch: ['<rootDir>/backend/**/*.{test,spec}.{js,ts}'],
      testEnvironment: 'node',
      transform: {
        '^.+\\.ts$': 'ts-jest'
      },
      moduleFileExtensions: ['ts', 'js', 'json'],
      testTimeout: 30000,
      collectCoverageFrom: [
        'backend/src/**/*.ts',
        '!backend/src/**/*.d.ts',
        '!backend/src/server.ts'
      ]
    }
  ],
  reporters: [
    'default',
    ['jest-html-reporter', {
      pageTitle: 'Sweet Shop - Complete Test Report (Frontend + Backend)',
      outputPath: './complete-test-report.html',
      includeFailureMsg: true,
      includeSuiteFailure: true,
      includeConsoleLog: false
    }]
  ],
  collectCoverage: true,
  coverageDirectory: './coverage',
  coverageReporters: ['text', 'lcov', 'html']
};