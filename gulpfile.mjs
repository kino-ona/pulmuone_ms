import browsersync from 'browser-sync';
import { deleteSync } from 'del';
import gulp from 'gulp';
import autoprefixer from 'gulp-autoprefixer';
import cached from 'gulp-cached';
import concat from 'gulp-concat';
import dependents from 'gulp-dependents';
import fileinclude from 'gulp-file-include';
import imagemin, { gifsicle , mozjpeg , optipng , svgo } from 'gulp-imagemin';
import newer from 'gulp-newer';
import noop from 'gulp-noop';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);

const
	paths = {
		html: 'src/**/*.html',
		scss: 'src/assets/css/**/*.scss',
		js: ['src/assets/js/lib/*.js', 'src/assets/js/modules/*.js', 'src/assets/js/*.js'],
		img: 'src/assets/images/**/*.{jpg,gif,png,svg}',
		inc: 'src/inc/**/*.inc'
	},

	dist = {
		html: 'dist',
		css: 'dist/assets/css',
		js: 'dist/assets/js',
		img: 'dist/assets/images',
	};

const onError = err => console.log(err);

if (process.env.NODE_ENV === 'development') {
	console.log('Gulp Development Build');
} else {
	console.log('Gulp Production Build');
}

// html
export function html(done) {
	return gulp.src(paths.html)
		.pipe(plumber({ errorHandler: onError }))
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file',
			context: {
				
			}
		}))
		.pipe(cached('html'))
		.pipe(gulp.dest(dist.html))
		.on('end', () => browsersync.reload()),
	done();
}

// scss
export function scss(done) {
	const options = {
		outputStyle: "compressed",  // 컴파일 스타일: expanded, compressed
		indentType: "tab",      // 들여쓰기 스타일: space(default), tab
		indentWidth: 1           // 들여쓰기 칸 수 (Default : 2)
	};

	return gulp.src(paths.scss, { since: gulp.lastRun(scss) })
		.pipe(plumber({ errorHandler: onError }))
		.pipe(dependents())
		.pipe(process.env.NODE_ENV === 'development' ? sourcemaps.init() : noop())
		.pipe(sass(options).on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(process.env.NODE_ENV === 'development' ? sourcemaps.write() : noop())
		.pipe(gulp.dest(dist.css))
		.pipe(browsersync.reload({ stream: true })),
	done();
}

// js
export function js(done) {
	return gulp.src(paths.js)
		.pipe(plumber({ errorHandler: onError }))
		.pipe(concat('micro.js'))
		.pipe(uglify())
		.pipe(gulp.dest(dist.js))
		.pipe(browsersync.reload({ stream: true })),
	done();
}

// image
export function image(done) {
	return gulp.src(paths.img)
		.pipe(newer(dist.img))
		.pipe(imagemin([
			gifsicle({interlaced: true}),
			mozjpeg({quality: 75, progressive: true}),
			optipng({optimizationLevel: 1}),
			svgo({
				plugins: [
					{
						name: 'removeViewBox',
						active: true
					},
					{
						name: 'cleanupIDs',
						active: false
					}
				]
			})
		], {
			verbose: true
		}))
		.pipe(gulp.dest(dist.img)),
	done();
}

// watch
export function watch(done) {
	gulp.watch([paths.html, paths.inc], html);
	gulp.watch(paths.scss, scss);
	gulp.watch(paths.js, js);
	gulp.watch(paths.img, image);
	done();
}

// server
export function server(done) {
	browsersync.init({
		server: {
			baseDir: 'dist',
			index: 'index.html'
		},
		open: false
	})
	done();
}

// clean
export function clean(done) {
	deleteSync(["dist/**/*", "!dist/assets", "dist/assets/**", "!dist/assets/fonts", "!dist/path/**", "!dist/path.html", "!dist/video", "!dist/lottie"]);
	done();
}

export const buildProd = gulp.series(clean, html, scss, js, image);
export const buildDev = gulp.series(image, scss, html, js, server, watch);