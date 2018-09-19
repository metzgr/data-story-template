// load file system module
var fs = require('fs');

// load uglify-js and uglifycss module
var UglifyJS = require('uglify-js');
var uglifycss = require('uglifycss');

var arrayOfFiles = ["../visualizations/ChartLibs/d3.v4.js", "../web/js/jquery.slim.min.js", "../web/js/popper.min.js", "../web/js/bootstrap.min.js", "../web/js/particles.min.js", "../web/js/lazysizes.min.js", "../visualizations/ChartLibs/d3-annotation.min.js", "../visualizations/ChartLibs/d3-array.v1.min.js", "../visualizations/ChartLibs/d3-geo.v1.min.js", "../visualizations/ChartLibs/d3-legend.js", "../visualizations/ChartLibs/d3-scale-chromatic.v1.min.js", "../visualizations/ChartLibs/d3-zoom.v1.min.js", "../visualizations/ChartLibs/queue.v1.min.js", "../visualizations/ChartLibs/topojson.v1.min.js", "../visualizations/ChartLibs/spin.min.js"];
var site_file_name = "../web/js/site.js";

var lib_files = {};

// parse files
arrayOfFiles.forEach(function (el) {
    var fileName = el.replace("../web/js/", "").replace("../visualizations/ChartLibs/", "");
    lib_files[fileName] = fs.readFileSync(el, "utf8");
});
var site_file = fs.readFileSync(site_file_name, "utf8");

// minify files
var result1 = UglifyJS.minify(lib_files);
var result2 = UglifyJS.minify(site_file);

// output js
fs.writeFile("prod/uglified.js", result1.code, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("JS libs were successfully compressed and saved.");
    }
});
fs.writeFile("prod/site.min.js", result2.code, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Site JS were successfully compressed and saved.");
    }
});

// minify css files
var UglifiedCss = uglifycss.processFiles(['../web/css/bootstrap.min.css', '../web/css/all.min.css', '../web/css/Glyphter.css', '../web/css/style.css', '../web/css/responsive.css']);

// output css
fs.writeFile("prod/uglified.css", UglifiedCss, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("CSS were successfully compressed and saved.");
    }
});