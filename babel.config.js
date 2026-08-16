module.exports = function (api) {
  // Key the Babel cache by NODE_ENV so api.env() can be used safely in plugins.
  // Using api.cache(true) with api.env() causes a "Caching already configured" crash.
  api.cache.using(() => process.env.NODE_ENV);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins: [
      ...(api.env('production') ? ['transform-remove-console'] : []),
      'react-native-reanimated/plugin', // Must be last
    ],
  };
};
