const {
    dest, parallel, series, src
} = require('gulp');
const $ = require('gulp-load-plugins')();
const rename = require('gulp-rename');
const gulpEslint = require('gulp-eslint');

const eslint = () => src(['**/*.js', '!node_modules/**', '!coverage/**', '!dist/**', '!db/**'])
    .pipe(gulpEslint())
    .pipe(gulpEslint.format())
    .pipe(gulpEslint.failAfterError());

const server = () => $.nodemon({
    script: './',
    env: {NODE_ENV: process.env.NODE_ENV || 'development'},
    ignore: ['./test/**/*.js'],
    nodeArgs: ['--inspect']
});

const clean = () => require('del')('dist');

const copy = () => src(
    [
        './src/**',
        './db/**',
        './public/**',
        'childProcess.js',
        'index.js',
        'knexfile.js'
    ], {base: '.'}
).pipe(dest('dist'));

const copyEnv = env => () => src(
    [env ? `.env-${env}` : '.env'], {base: '.'}
).pipe(rename('.env')).pipe(dest('dist/'));

const distPackage = () => src('./package.json')
    .pipe($.jsonEditor(json => {
        delete json.devDependencies;
        delete json.nodemonConfig;
        return json;
    }, {end_with_newline: true}))
    .pipe(dest('dist/'));

const dist = parallel(copy, distPackage);

exports.eslint = eslint;
exports.dev = server;
exports['build-dev'] = series(clean, dist, copyEnv());
exports['build-uat'] = series(clean, dist, copyEnv('uat'));
exports.build = series(clean, dist, copyEnv('prod'));
