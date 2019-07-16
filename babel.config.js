module.exports = {
    presets: [
        [
            '@vue/app',
            {
                useBuiltIns: 'entry'
            }
        ]
    ],
    plugins: [
        '@babel/plugin-syntax-dynamic-import',
        [
            'import',
            {
                libraryName: 'iview',
                libraryDirectory: 'src/components'
            }
        ]
    ]
}
