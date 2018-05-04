const fs = require('fs');
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = env => {
  return {
    entry: ['babel-polyfill', './src/index.js'],

    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.js$/,
          use: ['source-map-loader'],
          enforce: 'pre',
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: { minimize: true },
            },
          ],
        },
      ],
    },

    plugins: [
      new HtmlWebPackPlugin({
        template: './public/index.html',
        filename: './index.html',
      }),
    ],

    devtool: 'source-maps',

    devServer: {
      historyApiFallback: true,
      host: '0.0.0.0',
      allowedHosts: ['dev.chrisesplin.com', 'localhost'],
      contentBase: path.resolve('public'),
      https: {
        key: fs.readFileSync('/home/chris/.certs/chrisesplin.com/privkey.pem'),
        cert: fs.readFileSync('/home/chris/.certs/chrisesplin.com/cert.pem'),
        ca: fs.readFileSync('/home/chris/.certs/chrisesplin.com/fullchain.pem'),
      },
      before(app) {
        app.get('/environments/environment.js', (req, res) => {
          const devEnvironment = fs.readFileSync(
            './public/environments/environment.dev.js',
            'utf8'
          );
          res.setHeader('Content-Type', 'application/javascript');
          res.send(devEnvironment);
        });

        app.get('*', (req, res, next) => {
          const ending = req.url.split('/').pop();
          if (req.url != '/main.js' && ending == 'main.js') {
            res.redirect(302, '/main.js');
          } else {
            next();
          }
        });
      },

      watchOptions: {
        ignored: ['node_modules', '**/node_modules/**', '**/functions/**'],
      },
    },
  };
};
