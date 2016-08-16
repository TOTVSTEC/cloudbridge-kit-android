var task = module.exports,
	path = require('path'),
	shelljs = null;

task.run = function run(cli, projectData) {
	shelljs = cli.require('shelljs');

	var src = path.join(cli.projectDir, 'src', 'android'),
		target = path.join(cli.projectDir, 'build', 'android');

	shelljs.rm('-rf', src);
	shelljs.rm('-rf', target);
}
