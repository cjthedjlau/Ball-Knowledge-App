// Dynamic Expo config — filters native-only plugins when building for web.
// Vercel's `npx expo export --platform web` sets EXPO_PLATFORM=web; native
// builds via EAS set it to ios/android (or leave it unset).

const isWeb = process.env.EXPO_PLATFORM === 'web' ||
  process.argv.some(a => a.includes('--platform') && process.argv[process.argv.indexOf(a) + 1] === 'web') ||
  process.argv.includes('web');

// Plugins that require native modules (crash `expo export --platform web`)
const NATIVE_ONLY_PLUGINS = new Set([
  'expo-secure-store',
  'expo-apple-authentication',
  'expo-notifications',
  'react-native-google-mobile-ads',
]);

function filterPlugin(p) {
  const name = Array.isArray(p) ? p[0] : p;
  return !NATIVE_ONLY_PLUGINS.has(name);
}

// Load the static config from app.json
const appJson = require('./app.json');
const config = appJson.expo;

module.exports = () => ({
  ...config,
  plugins: isWeb
    ? (config.plugins || []).filter(filterPlugin)
    : config.plugins,
});
