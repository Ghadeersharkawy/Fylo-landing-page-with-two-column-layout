const gulp = require('gulp');
const browsersync = require('browser-sync');
const autoprifixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
// const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

// styles task
async function styles() {
	return (
		gulp
			.src('src/sass/**/*.scss')
			// .pipe(sourcemaps.init())
			.pipe(sass({ outputStyle: 'compressed' }))
			.on('error', sass.logError)
			.pipe(autoprifixer())
			// .pipe(sourcemaps.write())
			.pipe(rename('main.min.css'))
			.pipe(gulp.dest('dist/css'))
			.pipe(browsersync.stream())
	);
}

// styles plugins
async function styles_vendor() {
	return (
		gulp
			.src('src/plugins/**/*.css')
			// .pipe(sourcemaps.init())
			// .pipe(sourcemaps.write())
			.pipe(concat('vendor.min.css'))
			.pipe(gulp.dest('dist/css'))
			.pipe(browsersync.stream())
	);
}

// scripts task

async function scripts() {
	return gulp
		.src('src/js/**/*.js')
		.pipe(uglify())
		.pipe(rename('main.min.js'))
		.pipe(gulp.dest('dist/js'))
		.pipe(browsersync.stream());
}
// scripts vendors task

async function scripts_vendor() {
	return gulp
		.src('src/plugins/**/*.js')
		.pipe(uglify())
		.pipe(concat('vendor.min.js'))
		.pipe(gulp.dest('dist/js'))
		.pipe(browsersync.stream());
}

// images task

async function compress_images() {
	return gulp
		.src('src/images/**/*.*')
		.pipe(
			imagemin([
				imagemin.gifsicle({ interlaced: true }),
				imagemin.jpegtran({ progressive: true }),
				imagemin.optipng({ optimizationLevel: 5 }),
				imagemin.svgo({
					plugins: [{ removeViewBox: true }, { cleanupIDs: false }]
				})
			])
		)
		.pipe(gulp.dest('dist/images'))
		.pipe(browsersync.stream());
}

//watch task

async function watch() {
	browsersync.init({
		server: {
			baseDir: './'
		}
	});
	gulp.watch('src/sass/**/*.scss', styles);
	gulp.watch('src/plugins/**/*.css', styles_vendor);
	gulp.watch('src/plugins/**/*.js', scripts_vendor);
	gulp.watch('src/js/**/*.js', scripts);
	gulp.watch('src/images/**/*.*', compress_images);
	gulp.watch('./*.html').on('change', browsersync.reload);
}

exports.default = gulp.series(
	styles,
	gulp.parallel([styles_vendor, scripts_vendor, scripts]),
	compress_images,
	watch
);
