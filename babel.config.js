module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          assets: './src/assets',
          images: './src/assets/images/',
          components: './src/components',
          forms: './src/forms',
          styles: './src/styles',
          utils: './src/utils',
          navigation: './src/navigation',
        },
      },
    ],
  ],
};
