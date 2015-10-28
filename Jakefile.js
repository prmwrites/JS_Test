(function() {
/*global desc, task, jake, fail, complete */

"use strict";

var semver = require("semver");

task("default", ["version", "lint", "test"], function() {
	console.log("\nBUILD OK");
});

desc("Lint everything");
task("lint", ["version"], function() {
	var lint = require("./build/lint/lint_runner.js");

	var files = new jake.FileList();
	files.include("**/*.js");
	files.exclude("node_modules");
	var options = nodeLintOptions();
	var passed = lint.validateFileList(files.toArray(), options, {});
	if (!passed) fail("Lint failed.");
});

desc("Test everything");
task("test", ["version"], function() {
	var reporter = require("nodeunit").reporters["default"];
	reporter.run(['src/server/_server_test.js'], null, function(failures) {
			if (failures) fail("Tests failed");
			complete();
		});
	}, {async: true});

desc("Integrate");
task("integrate", [ "default" ], function() {
	console.log("1. Make sure 'git status' is clean.");
	console.log("2. Build on the integration box.");
	console.log("	a. walk over to the integration box");
	console.log("	b. 'git pull'");
	console.log("	c. 'jake'.");
	console.log("	d. if 'jake' fails, stop! Try again after fixing issue.");
	console.log("3. 'git checkout integration'");
	console.log("4. 'git merge master --no-ff --log'");
	console.log("5. 'git checkout master'");
});

desc("Check Node version");
	task("version", function() {
		console.log("Check Node version: .");
		
		var packageJson = require("./package.json");
		var expectedVersion = packageJson.engines.node;
		var actualVersion = process.version;

		if (semver.neq(expectedVersion, actualVersion)) {
			fail("Incorrect Node version: expected " + expectedVersion + ", but was " + actualVersion);
		} 
	});

function nodeLintOptions() {
 return {
		bitwise: true,
		curly: false,
		eqeqeq: true,
		forin: true,
		immed: true,
		latedef: "nofunc",
		newcap: true,
		noarg: true,
		noempty: true,
		nonew: true,
		regexp: true,
		undef: true,
		strict: true,
		trailing: true,
		node: true
	};
}

}());