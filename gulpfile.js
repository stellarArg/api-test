
const gulp = require('gulp');
const plugins = require('gulp-load-plugins');
const $ = plugins();


gulp.task('lint', () => {
  return gulp.src(['**/*.js', '!node_modules/**', '!coverage/**'])
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});

gulp.task('mocha', () => {
  return gulp.src('app/**/*.js')
      .pipe($.istanbul())
      .on('finish', () => {
        return gulp.src('test/**/*.test.js')
          .pipe($.mocha({ reporter: 'spec' }))
          .pipe($.istanbul.writeReports())
          .on('error', process.exit.bind(process, 1))
          .on('end', process.exit.bind(process));
      });
});

gulp.task('server', () => {
  return $.nodemon({
    script: './app/www/index.js',
    env: { 'NODE_ENV': process.env.NODE_ENV || 'development' },
    ignore: ['./test/**/*.js'],
    nodeArgs: ['--debug']
  });
});

gulp.task('test', ['lint', 'mocha']);
gulp.task('dev', ['server']);
