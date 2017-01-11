var task = module.exports,
	path = require('path'),
	shelljs = null;

task.run = function run(cli, targetPath, projectData) {
	shelljs = cli.require('shelljs');
	Q = cli.require('q');

	var target = path.join(targetPath, 'build', 'android');

	shelljs.rm('-rf', target);

	return Q();
};
