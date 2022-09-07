const gulp = require("gulp");
const pug = require("gulp-pug");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssSorter = require("css-declaration-sorter");
const mmq = require("gulp-merge-media-queries");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const browserSync = require("browser-sync");

function test(done) {
	console.log("Hello Gulp");
	done();
}

function compilePug() {
	return gulp.src(["./src/**/*.pug","!./src/**/_*.pug"])
		.pipe(plumber({
			errorHandler: notify.onError("Error: <%= error.message %>")
		}))
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest("./public"))
}

function compileSass() {
	return gulp.src("./src/assets/sass/**/*.scss")
	.pipe(plumber({
		errorHandler: notify.onError("Error: <%= error.message %>")
	}))
	.pipe(sass())
	.pipe(postcss([autoprefixer(), cssSorter()]))
	.pipe(mmq())
	.pipe(gulp.dest("./public/assets/css/"))
}

function watch() {
	gulp.watch("./src/assets/sass/**/*.scss", gulp.series(compileSass, browserReload))

}

function browserReload(done) {
	browserSync.reload();
	done();
}

function task() {
	gulp.watch("./src/**/*.pug", gulp.series(compilePug, browserReload)),
	gulp.watch("./src/assets/sass/**/*.scss", gulp.series(compileSass, browserReload))

}

exports.test = test;
exports.compilePug = compilePug;
exports.compileSass = compileSass;
exports.watch = watch;
exports.task = task;
exports.dev = gulp.series(compilePug, watch);