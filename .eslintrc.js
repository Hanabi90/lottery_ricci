module.exports = {
    root: true,
    env: {
        node: true,
        es6: true
    },
    extends: ['plugin:vue/essential'],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }]
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
}
