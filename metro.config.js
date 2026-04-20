const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// On web, replace react-native-google-mobile-ads with an empty stub
// (it imports native-only codegen modules that crash the web bundler)
const prevResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    platform === 'web' &&
    (moduleName === 'react-native-google-mobile-ads' ||
     moduleName.startsWith('react-native-google-mobile-ads/'))
  ) {
    return {
      type: 'sourceFile',
      filePath: path.resolve(__dirname, 'src/lib/empty-module.js'),
    };
  }
  if (prevResolveRequest) {
    return prevResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
