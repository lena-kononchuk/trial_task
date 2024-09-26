import gulp from 'gulp'; // Importing Gulp
import imagemin from 'gulp-imagemin'; // Importing imagemin for image optimization
import uglify from 'gulp-uglify'; // Importing uglify for JavaScript minification
import concat from 'gulp-concat'; // Importing concat for combining JavaScript files
import rename from 'gulp-rename'; // Importing rename for renaming files
import cleanCSS from 'gulp-clean-css'; // Importing cleanCSS for CSS minification
import sourcemaps from 'gulp-sourcemaps'; // Importing sourcemaps for generating source maps
import htmlmin from 'gulp-htmlmin'; // Importing htmlmin for HTML minification
import { deleteAsync } from 'del'; // Importing deleteAsync for cleaning the build folder

// Paths to source files and destination folder
const paths = {
  html: {
    src: 'Index.html', // Source HTML file
    dest: 'build/' // Destination folder for HTML
  },
  styles: {
    // Minified version of CSS that you are already using
    src: 'css/styles.min.css', // Path to the minified CSS file
    dest: 'build/css/' // Destination folder for CSS
  },
  scripts: {
    src: ['js/app.js', 'js/validation.js', 'js/range.js'],
    dest: 'build/js/' // Destination folder for JavaScript
  },
  images: {
    src: 'img/**/*', // Source image files
    dest: 'build/img/' // Destination folder for images
  }
};

// Clean task to delete the build folder
const clean = () => {
  return deleteAsync(['build']); // Cleaning the build folder
};

// Task for processing HTML files
const html = () => {
  return gulp.src(paths.html.src) // Source HTML file
    .pipe(htmlmin({ collapseWhitespace: true })) // Minifying HTML
    .pipe(gulp.dest(paths.html.dest)); // Saving minified HTML to the build folder
};

// Task for copying minified CSS (using the already minified file)
const styles = () => {
  return gulp.src(paths.styles.src) // Source minified CSS file
    .pipe(gulp.dest(paths.styles.dest)); // Simply copying the minified CSS to the build folder
};

// Task for processing and minifying JavaScript files
const scripts = () => {
  return gulp.src(paths.scripts.src) // Source JavaScript files
    .pipe(sourcemaps.init()) // Initializing sourcemaps
    .pipe(concat('main.js')) // Concatenating all JavaScript files into one
    .pipe(uglify()) // Minifying JavaScript
    .pipe(rename({ suffix: '.min' })) // Renaming to *.min.js
    .pipe(sourcemaps.write('.')) // Writing sourcemaps
    .pipe(gulp.dest(paths.scripts.dest)); // Saving minified JavaScript to the build folder
};

// Task for optimizing images
const images = () => {
  return gulp.src(paths.images.src) // Source image files
    .pipe(imagemin()) // Optimizing images
    .pipe(gulp.dest(paths.images.dest)); // Saving optimized images to the build folder
};

// Watch files for changes
const watchFiles = () => {
  gulp.watch(paths.html.src, html); // Watching HTML files
  gulp.watch(paths.styles.src, styles); // Watching CSS files
  gulp.watch(paths.scripts.src, scripts); // Watching JavaScript files
  gulp.watch(paths.images.src, images); // Watching image files
};

// Defining complex tasks
const build = gulp.series(clean, gulp.parallel(html, styles, scripts, images)); // Build task
const watch = gulp.series(build, watchFiles); // Watch task

// Exporting tasks for CLI usage
export { clean, html, styles, scripts, images, build, watch };
