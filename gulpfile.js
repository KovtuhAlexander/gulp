var gulp      	 = require('gulp'),
		del          = require('del'),
		pug				   = require('gulp-pug'),
    sass         = require('gulp-sass'),
		cache        = require('gulp-cache'),
		concat       = require('gulp-concat'),
		rename       = require('gulp-rename'),
		uglify       = require('gulp-uglify'),
		buffer			 = require('vinyl-buffer'),
		source       = require('vinyl-source-stream'),
		cssnano      = require('gulp-cssnano'),
		plumber      = require('gulp-plumber'),
		pngquant     = require('imagemin-pngquant'),
		imagemin     = require('gulp-imagemin'),
		uglifycss    = require('gulp-uglifycss'),
		browserify   = require('browserify'),
    browserSync  = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('pug', function(){
	gulp.src('src/pug/*.pug')
			.pipe(plumber())
			.pipe(pug({
				pretty: true
			}))
			.pipe(gulp.dest('./src'))
});

gulp.task('sass', function(){
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer(['last 5 versions', '> 1%', 'ie 8'], { cascade: true }))
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('scripts', function() {
    return browserify('src/js/main.js')
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('src/js'))

});

gulp.task('b-scripts', function() {
    return browserify('src/js/main.js')
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'src'
        },
        notify: false
    });
});


gulp.task('watch', ['browser-sync', 'pug', 'scripts'], function() {
    gulp.watch('src/scss/**/*.scss', ['sass']);
		gulp.watch('src/pug/**/*.pug', ['pug']);
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/js/**/*.js', browserSync.reload);
});


gulp.task('img', function() {
    return gulp.src('src/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['clean', 'img', 'sass', 'b-scripts'], function() {

    var buildCss = gulp.src([
        'src/css/main.css',
        ])
		.pipe(uglifycss())
    .pipe(gulp.dest('dist/css'));

    var buildFonts = gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));

    var buildJs = gulp.src('src/js/bundle.js')
		.pipe(uglify())
    .pipe(gulp.dest('dist/js'));

    var buildHtml = gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));

});

gulp.task('clean', function() {
	return del.sync('dist/*');
});

gulp.task('clear', function () {
    return cache.clearAll();
});

gulp.task('default', ['watch']);
