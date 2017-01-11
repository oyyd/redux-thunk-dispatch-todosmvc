var gulp = require('gulp');
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var DeepMerge = require('deep-merge');
var chokidar = require('chokidar');
var devMiddleware = require('webpack-dev-middleware');
var hotMiddleware = require('webpack-hot-middleware');
var signalMiddleware = require('redux-thunk-dispatch/signal-middleware');
var childProcess = require('child_process');
var express = require('express');

var deepmerge = DeepMerge(function(target, source, key) {
  if(target instanceof Array) {
    return [].concat(target, source);
  }
  return source;
});

// generic
var defaultConfig = {};

if(process.env.NODE_ENV !== 'production') {
  //defaultConfig.devtool = '#eval-source-map';
  defaultConfig.devtool = 'source-map';
  defaultConfig.debug = true;
}

function config(overrides) {
  return deepmerge(defaultConfig, overrides || {});
}

// frontend

var frontendConfig = config({
  entry: [
    'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr',
    'redux-thunk-dispatch/redispatch-event?path=http://localhost:3000/__dispatch_signal',
    './static/src/index.js',
  ],
  output: {
    path: path.join(__dirname, 'static/build'),
    publicPath: 'http://localhost:3000/build',
    filename: 'frontend.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loaders: [
        'react-hot-loader/webpack',
        'babel-loader',
      ],
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader',
    }],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
});

// tasks
function onBuild(done) {
  return function(err, stats) {
    if(err) {
      console.log('Error', err);
    }
    else {
      console.log(stats.toString());
    }

    if(done) {
      done();
    }
  }
}

gulp.task('build', function(done) {
  webpack(frontendConfig).run(onBuild(done));
});

gulp.task('watch', function() {
  var updateTime = 0;
  var compiler = webpack(frontendConfig);

  var app = express();

  app.use(devMiddleware(compiler, {
    publicPath: frontendConfig.output.publicPath,
    hot: true
  }));

  app.use(hotMiddleware(compiler));

  app.use(signalMiddleware());

  app.get('/__get_updatetime', (req, res) => {
    res.send({
      updateTime: updateTime,
    });
  });

  app.get('/__set_updatetime', (req, res) => {
    // TODO: use hash id directly
    var _updateTime = req.query['update_time'];

    if (_updateTime) {
      updateTime = _updateTime;

      res.send({
        success: true,
      });

      return;
    }

    res.send({
      success: false,
    });
  });

  app.listen(3000, 'localhost', function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log('webpack dev server listening at localhost:3000');
    }
  });
});

gulp.task('server', function() {
  var child = null;

  function start() {
    if (child) {
      child.kill();
    }

    child = childProcess.fork(path.join(__dirname, './src/main.js'));
  }

  start();

  chokidar.watch(path.join(__dirname, './src'), {
    ignoreInitial: true,
    awaitWriteFinish: true,
  }).on('all', (event, path) => {
    start();
  });
});

gulp.task('run', ['watch', 'server']);
