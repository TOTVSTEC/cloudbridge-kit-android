var task = module.exports,
	path = require('path'),
	shelljs = null;

task.run = function run(cli, targetPath) {
	shelljs = cli.require('shelljs');

	var src = path.join(targetPath, 'src', 'android'),
		target = path.join(targetPath, 'build', 'android');

	shelljs.rm('-rf', src);
	shelljs.rm('-rf', target);
};
