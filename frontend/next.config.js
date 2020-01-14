
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  })
  
  const nextConfig = {
    // any configs you need
    // webpack(config, options) {
    //     if (enabled) {
    //       const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
    //       config.plugins.push(
    //         new BundleAnalyzerPlugin({
    //           analyzerMode: 'static',
    //           reportFilename: options.isServer
    //             ? '../analyze/server.html'
    //             : './analyze/client.html',
    //         })
    //       )
    //     }
  
    //     if (typeof nextConfig.webpack === 'function') {
    //       return nextConfig.webpack(config, options)
    //     }
    //     return config
    //   },
  }
  
  module.exports = withBundleAnalyzer(nextConfig)