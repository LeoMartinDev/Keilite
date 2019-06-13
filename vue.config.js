module.exports = {
  configureWebpack: {
    devtool: 'source-map',
  },
  pluginOptions: {
    electronBuilder: {
      externals: ['native-process'],
      nodeModulesPath: ['./node_modules'],
    },
  },
};
