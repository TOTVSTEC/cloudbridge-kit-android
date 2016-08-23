var task = module.exports,
	path = require('path'),
	Q = null,
	shelljs = null,
	utils = null,
	data = null,
	projectDir = null,
	cloudbridge = null;

task.run = function run(cli, targetPath) {
	cloudbridge = cli;
	projectDir = targetPath;
	Q = cloudbridge.require('q');
	shelljs = cloudbridge.require('shelljs');
	utils = cloudbridge.utils;
	data = {
		project: require(path.join(targetPath, 'cloudbridge.json'))
	};

	return Q()
		.then(copySources)
		.then(copyDependencies)
		.then(moveJavaToPackage);
};

function copySources() {
	var src = path.join(__dirname, 'src'),
		target = path.join(projectDir, 'src'),
		extensions = /\.(gradle|xml|java)/;

	utils.copyTemplate(src, target, data, extensions);
};

function copyDependencies() {
	var src = path.join(__dirname, 'build', '*'),
		target = path.join(projectDir, 'build');

	shelljs.cp('-Rf', src, target);
};

function moveJavaToPackage() {
	var src = path.join(projectDir, 'src', 'android', 'java'),
		packagePath = path.join.apply(path, data.project.id.split('.')),
		target = path.join(src, packagePath);

	shelljs.mkdir('-p', target);

	var files = shelljs.ls(path.join(src, '*.java'));

	for (var i = 0; i < files.length; i++) {
		var targetFile = path.join(target, data.project.name + path.basename(files[i]));

		shelljs.mv(files[i], targetFile);
	}
}
