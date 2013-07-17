#!/usr/bin/env node


var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest    = require('restler');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT = "http://protected-hollows-2561.herokuapp.com/";


var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};


/*
var webpage_fetch = function(response,status){
    console.log(response);
} 


rest.get(url).on('complete', webpage_fetch);
console.log("This prints during fetch.");
*/

var getResponse = function(url){

    var result = rest.get(url).on('complete', function(response){
	response;
    });
    var instr = result.toString(); 
};
/*
var processResponse(data){
    var instr = data.toString();
    return instr;
};
*/

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url ', 'Path to URL', clone(getResponse), URL_DEFAULT)   
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .parse(process.argv);
    var checkJson = checkHtmlFile(program.file, program.checks);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
