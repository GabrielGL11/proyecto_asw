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
};
