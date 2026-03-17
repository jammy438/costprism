/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: require('path').join(__dirname, '../../'),
  webpack: (config) => {
    config.resolve.conditionNames = config.resolve.conditionNames?.filter(
      (condition) => condition !== '@tanstack/custom-condition'
    ) ?? ['import', 'module', 'require', 'default']
    
    config.resolve.alias['@tanstack/react-query'] = require('path').resolve(
      __dirname, 
      '../../node_modules/@tanstack/react-query/build/modern/index.js'
    )
    return config
  },
}

module.exports = nextConfig