module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins: [
      ...(api.env('production') ? ['transform-remove-console'] : []),
      'react-native-reanimated/plugin', // Must be last
    ],
  };
};
