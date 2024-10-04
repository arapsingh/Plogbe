module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true, // Thêm dòng này để hỗ trợ Node.js
        jest: true, // Thêm dòng này để hỗ trợ các biến của Jest
    },
    parser: '@typescript-eslint/parser',

    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:prettier/recommended',
        'prettier',
        'plugin:@typescript-eslint/recommended',
    ],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    plugins: ['react', 'prettier', 'import', '@typescript-eslint'],
    rules: {
        'prettier/prettier': [
            'warn',
            {
                endOfLine: 'auto',
                singleQuote: true,
            },
        ],
        'import/named': 'error',
        'import/default': 'error',
        'import/namespace': 'error',
        'no-undef': 'error',
        'no-unused-vars': 'warn',
        'import/no-unresolved': ['error', { commonjs: true }],
        'react/react-in-jsx-scope': 'off', // Vô hiệu hóa yêu cầu React phải ở trong scope khi sử dụng JSX
        '@typescript-eslint/no-var-requires': 'off',
    },
    settings: {
        react: {
            version: 'detect',
        },
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
            node: {
                paths: ['src'],
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
                moduleDirectory: ['node_modules', 'src/'],
            },
            typescript: {
                alwaysTryTypes: true,
            },
        },
    },
};
