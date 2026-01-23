const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add .riv as an asset extension for bundling Rive files
config.resolver.assetExts.push('riv');

module.exports = config;
