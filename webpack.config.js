const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: isProduction ? './src/index.js' : './test/test-three-scene.js',

    output: isProduction ? {
      path: path.resolve(__dirname, 'dist'),
      filename: 'qarl.es.min.js',
      library: {
        type: 'module'
      },
      clean: true
    } : {
      path: path.resolve(__dirname, 'dev-dist'),
      filename: 'bundle.js',
      clean: true
    },

    experiments: {
      outputModule: true
    },

    resolve: {
      extensionAlias: {
        '.js': ['.js', '.ts']
      }
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          type: 'javascript/esm'
        },
        {
          test: /node_modules/,
          type: 'javascript/auto'
        },
        {
          test: /\.mjs$/,
          type: 'javascript/esm'
        }
      ]
    },

    externals: isProduction ? {} : undefined,

    plugins: isProduction ? [] : [
      new HtmlWebpackPlugin({
        template: './test/index.html',
        filename: 'index.html'
      })
    ],

    optimization: isProduction ? {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false
            }
          },
          extractComments: false
        })
      ]
    } : {
      minimize: false
    },

    devServer: isProduction ? undefined : {
      static: {
        directory: path.join(__dirname, 'test')
      },
      compress: true,
      port: 8081,
      open: true,
      hot: true,
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
      },
      onListening: function(devServer) {
        if (!devServer) {
          throw new Error('webpack-dev-server is not defined');
        }
        const port = devServer.server.address().port;
        console.log('Listening on port:', port);
      }
    }
  };
};
