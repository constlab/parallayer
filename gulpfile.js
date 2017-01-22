'use strict';

// ==== Packages ==== //

var gulp         = require('gulp'),
	concat       = require('gulp-concat'),
	csso         = require('gulp-csso'),
	less         = require('gulp-less'),
	autoprefixer = require('gulp-autoprefixer'),
	uglify       = require('gulp-uglify'),
	wrap         = require("gulp-wrap"),
	browserSync  = require('browser-sync'),
	del          = require('del'),
	csscomb      = require('gulp-csscomb'),
	notify       = require('gulp-notify'),
	multipipe    = require('multipipe'),
	header       = require('gulp-header');

// ==== Paths ==== //

const paths = {
	docs: {
		html: 'docs/',
		img:  'docs/assets/img/',
		css:  'docs/assets/css/',
		js:   'docs/assets/js/'
	},
	src: {
		html: [
			'src/*.html'
		],
		img: [
			'src/assets/img/**/*'
		],
		css: {
			main: [
				'node_modules/normalize.css/normalize.css',
				'src/assets/less/main.less'
			]
		},
		js: {
			jquery: [
				'node_modules/jquery/dist/jquery.min.js'
			],
			parallayer: [
				'src/assets/js/parallayer.js'
			]
		}
	},
	watch: {
		html: 'src/**/*.html',
		img:  'src/assets/img/**/*',
		css:  'src/assets/less/**/*.less',
		js:   'src/assets/js/**/*.js'
	}
};

// ==== Header ==== //

var pkg = require('./package.json'),
	banner = ['/*!',
		' * <%= pkg.title %> v<%= pkg.version %> by <%= pkg.author %>',
		' * <%= pkg.description %>',
		' * Demo: <%= pkg.homepage %>',
		' * License: <%= pkg.license %>',
		' */',
		''].join('\n');

// ==== Browser Sync Config ==== //

const browserSyncConfig = {
	server: {
		baseDir: 'docs'
	},
	notify: false
};

// ==== Build ==== //

gulp.task('html', function() {
	return multipipe(
		gulp.src(paths.src.html),
		gulp.dest(paths.docs.html),
		browserSync.stream()
	).on('error', notify.onError(function(err) {
		return {
			title: 'html',
			message: 'Line: ' + err.line
		}
	}));
});

gulp.task('img', function() {
	return multipipe(
		gulp.src(paths.src.img),
		gulp.dest(paths.docs.img)
	).on('error', notify.onError(function(err) {
		return {
			title: 'img',
			message: 'Line: ' + err.line
		}
	}));
});

gulp.task('css:main', function() {
	return multipipe(
		gulp.src(paths.src.css.main),
		concat('main.min.css'),
		less(),
		autoprefixer(),
		csscomb(),
		csso(),
		gulp.dest(paths.docs.css),
		browserSync.stream()
	).on('error', notify.onError(function(err) {
		return {
			title: 'css:main',
			message: 'Line: ' + err.line
		}
	}));
});

gulp.task('js:jquery', function() {
	return multipipe(
		gulp.src(paths.src.js.jquery),
		concat('jquery.min.js'),
		gulp.dest(paths.docs.js)
	).on('error', notify.onError(function(err) {
		return {
			title: 'js:jquery',
			message: 'Line: ' + err.line
		}
	}));
});

gulp.task('js:parallayer', function() {
	return multipipe(
		gulp.src(paths.src.js.parallayer),
		concat('parallayer.min.js'),
		wrap("(function($){'use strict';<%= contents %>})(jQuery);"),
		uglify(),
		header(banner, {pkg: pkg}),
		gulp.dest(paths.docs.js),
		browserSync.stream()
	).on('error', notify.onError(function(err) {
		return {
			title: 'js:parallayer',
			message: 'Line: ' + err.line
		}
	}));
});

// ==== Browser Sync ==== //

gulp.task('browser-sync', function() {
	browserSync(browserSyncConfig);
});

// ==== Watch ==== //

gulp.task('watch', ['browser-sync', 'html', 'img', 'css:main', 'js:parallayer'], function() {
	gulp.watch(paths.watch.html, ['html']);
	gulp.watch(paths.watch.img, ['img']);
	gulp.watch(paths.watch.css, ['css:main']);
	gulp.watch(paths.watch.js, ['js:parallayer']);
});

// ==== Clean ==== //

gulp.task('clean', function() {
	return del.sync(['docs/**', '!docs']);
});

// ==== Default ==== //

gulp.task('default', ['html', 'img', 'css:main', 'js:jquery', 'js:parallayer']);
