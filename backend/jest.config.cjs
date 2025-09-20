module.exports = {
  testMatch: ['<rootDir>/backend/**/*.{test,spec}.{js,ts}'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  testTimeout: 30000,
  reporters: [
    'default',
    ['jest-html-reporter', {
      pageTitle: 'Sweet Shop API - Test Report',
      outputPath: './test-report.html',
      includeFailureMsg: true,
      includeSuiteFailure: true,
      includeConsoleLog: true
    }]
  ],
  collectCoverage: true,
  coverageDirectory: './coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'backend/src/**/*.ts',
    '!backend/src/**/*.d.ts'
  ]
};