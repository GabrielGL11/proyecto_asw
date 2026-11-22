export default {
    testEnvironment: 'node',
    testMatch: ['**/*.e2e-spec.ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    transform: {
        '^.+\\.tsx?$': [
        'ts-jest',
        {
            useESM: false,
            tsconfig: 'tsconfig.jest.json',
        },
        ],
    },
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    clearMocks: true,
    // Apunta la aplicación a la base de datos _test en cada archivo de prueba.
    setupFiles: ['<rootDir>/test/setup-env.ts'],
    // Los archivos E2E comparten la misma base de datos: se ejecutan uno tras otro.
    maxWorkers: 1,
    testTimeout: 30000,
};
