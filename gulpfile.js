var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var connect = require('gulp-connect');
var jsHint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var minimist = require('minimist');
var ngConfig = require('gulp-ng-config');
var plumber = require('gulp-plumber');
var karma = require('gulp-karma');
var clean = require('gulp-clean');
var jscs = require('gulp-jscs');
var jscsStylish = require('gulp-jscs-stylish');
var jshintXMLReporter = require('gulp-jshint-xml-file-reporter');

var knownOptions = {
    string: 'env',
    default: {env: 'localhost'}
};

var options = minimist(process.argv.slice(2), knownOptions);

var scriptRoot = 'js';
var scriptFolder = scriptRoot + '/**/*.js';
var jsHintOutput = './jshint.xml';

gulp.task('scripts', function() {
    return gulp.src(scriptFolder)
        .pipe(plumber())

        .pipe(sourcemaps.init())
            .pipe(concat('app.js'))
            .pipe(ngAnnotate())
            .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('sass', function() {
    return gulp.src('css/sv-styles.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
            .pipe(sass({
                //outputStyle: 'compressed',
                includePaths: ['bower_components/bootstrap-sass/assets/stylesheets/']
            }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('fonts', function() {
    return gulp.src(['bower_components/bootstrap/fonts/*.*'])
        .pipe(gulp.dest('dist/fonts/bootstrap/'));
});

gulp.task('vendorScripts', function() {
    return gulp.src([
            'bower_components/**/angular.js',
            'bower_components/**/angular-resource.js',
            'bower_components/**/dist/jquery.js',
            'bower_components/**/assets/javascripts/bootstrap.js',
            'bower_components/**/release/angular-ui-router.min.js',
            'bower_components/**/ui-bootstrap-tpls.js'
        ])
        .pipe(plumber())
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('templates', function() {
    gulp.src('index.html').pipe(gulp.dest('dist'));
    gulp.src('partials/**/*.html').pipe(gulp.dest('dist/partials'));
    return gulp.src('imgs/**/*').pipe(gulp.dest('dist/imgs'));
});

gulp.task('test', function() {
    //Returning fake file so as to run the karma.conf.js files instead
    return gulp.src('./fake')
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }))
        .on('error', function (err) {
            console.log(err);
            this.emit('end');
        });
});

gulp.task('watch', ['sass', 'scripts', 'templates', 'lint'], function() {
    gulp.watch('css/**/*.scss', ['sass']);
    gulp.watch(scriptFolder, ['scripts', 'lint']);
    gulp.watch('specs/*.js', ['scripts', 'lint']);
    gulp.watch([
            'index.html',
            'partials/**/*.html',
            'imgs/**/*'
        ], ['templates']
    );
});

gulp.task('server', function() {
    var env = options.env || 'localhost';

    gulp.src('config.json')
        .pipe(ngConfig('app.config', {
            environment: env
        }))
        .pipe(gulp.dest('dist'));

    connect.server({
        root: 'dist',
        port: 8080,
        fallback: 'dist/index.html'
    });
});

gulp.task('lint', function() {
    return gulp.src(scriptFolder)
        .pipe(jsHint())
        .pipe(jscs())
        .on('error', function() {})
        .pipe(jscsStylish.combineWithHintResults())
        .pipe(jsHint.reporter(stylish));
});

gulp.task('lint-xmlout', function() {
    return gulp.src(scriptFolder)
        .pipe(jsHint())
        .pipe(jscs())
        .on('error', function() {})
        .pipe(jscsStylish.combineWithHintResults())
        .pipe(jsHint.reporter(stylish))
        .pipe(jsHint.reporter(jshintXMLReporter))
        .on('end', jshintXMLReporter.writeFile({
            format: 'checkstyle',
            filePath: jsHintOutput
        }));
});

gulp.task('clean', function() {

    gulp.src(jsHintOutput, {read: false})
        .pipe(clean());

    return gulp.src('dist', {read: false})
        .pipe(clean());
});

//Default Task
gulp.task('default', function() {

    gulp.start('lint');
    gulp.start('templates');
    gulp.start('sass');
    gulp.start('fonts');
    gulp.start('scripts');
    gulp.start('vendorScripts');
    gulp.start('server');
    gulp.start('watch');
})

gulp.task('jenkins', function() {

    gulp.start('lint-xmlout');
    gulp.start('templates');
    gulp.start('sass');
    gulp.start('fonts');
    gulp.start('scripts');
    gulp.start('vendorScripts');
})
