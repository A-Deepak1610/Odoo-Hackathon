module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/core/logger/**/*.js'
  ],
  coverageDirectory: 'coverage',
  clearMocks: true
};
