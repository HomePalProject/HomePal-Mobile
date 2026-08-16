const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Force Metro to transpile @gorhom packages from source (needed for bottom-sheet & portal)
config.resolver = {
  ...config.resolver,
  unstable_enablePackageExports: false,
};

config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

module.exports = withNativeWind(config, { input: './global.css', inlineRem: 16 });
