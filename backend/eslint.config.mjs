import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginPrettier from 'eslint-plugin-prettier';
import configPrettier from 'eslint-config-prettier';
import pluginImport from 'eslint-plugin-import';

export default [
    {
        files: ['**/*.js'],
        languageOptions: {
            sourceType: 'commonjs',
            globals: globals.node, // Cung cấp các biến toàn cục cho Node.js
            ecmaVersion: 2020, // Đặt phiên bản ECMAScript
        },
        plugins: {
            prettier: pluginPrettier,
            import: pluginImport,
        },
        rules: {
            // Quy tắc từ cấu hình mặc định của ESLint
            ...pluginJs.configs.recommended.rules,

            // Quy tắc từ Prettier (các quy tắc này được xác định trong cấu hình Prettier)
            ...pluginPrettier.configs.recommended.rules,
            // Quy tắc bổ sung của bạn
            'import/named': 'error', // Kiểm tra rằng các thành viên được yêu cầu là hợp lệ
            'import/default': 'error', // Kiểm tra rằng các giá trị mặc định được yêu cầu là hợp lệ
            'import/namespace': 'error', // Kiểm tra rằng các không gian tên được yêu cầu là hợp lệ
            'no-undef': 'error',
            'no-unused-vars': 'warn',
            'prettier/prettier': 'warn', // Xem các lỗi định dạng của Prettier như lỗi ESLint
            'prettier/prettier': [
                'warn',
                {
                    endOfLine: 'auto',
                },
            ],
            'import/no-unresolved': ['error', { commonjs: true }],
            
        },
        settings: {
            // Nếu bạn cần cài đặt đặc biệt cho Prettier
            'import/resolver': {
                node: {
                    paths: ['src'], // Thay thế bằng thư mục gốc của bạn
                    extensions: ['.js', '.jsx', '.ts', '.tsx'],
                },
            },
        },
    },
    {
        // Các cấu hình riêng cho các tệp khác, nếu cần
        files: ['**/*.test.js'],
        rules: {
            // Các quy tắc dành riêng cho các tệp test
        },
    },
];
