const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Simple NativeWind integration
const { withNativeWind } = require('nativewind/metro');

module.exports = withNativeWind(config, { input: './global.css' });