var task = module.exports,
	path = require('path'),
	fs = require('fs'),
	os = require('os'),
	utils = null,
	Q = null,
	semver = null,
	shelljs = null;

task.run = function run(cli, targetPath, projectData) {
	var task = new UpdateTask(cli, targetPath, projectData);

	return task.run();
};


class UpdateTask {

	constructor(cli, targetPath, projectData) {
		this.cli = cli;
		this.projectDir = targetPath;
		this.projectData = projectData;

		shelljs = cli.require('shelljs');
		Q = cli.require('q');
		semver = cli.require('semver');
		utils = cli.utils;
	}

	run() {
		return Q()
			.then(() => {
				var remove = require('./remove');

				return remove.run(cli, this.projectDir, this.projectData);
			})
			.then(() => {
				var restoreTask = require('./restore');

				return restoreTask.run(cli, this.projectDir, this.projectData);
			})
			.then(() => {
				let platforms = (this.projectData.platform || {});

				if (platforms.android) {
					let platformVersion = semver.coerce(platforms.android);

					if (semver.lt(platformVersion, '0.2.0')) {
						return this.renameSources();
					}
				}
			});
	}

	renameSources() {
		var srcPath = path.join(this.projectDir, 'src', 'android', 'build.gradle');

		if (fs.existsSync(srcPath)) {
			let targetPath = srcPath + '.old';

			if (fs.existsSync(targetPath)) {
				var count = 1;
				while (fs.existsSync(targetPath + '.' + count)) {
					count++;
				}

				targetPath += '.' + count;
			}

			console.log('');
			console.log('Renaming your android build file (' + srcPath + ') to (' + targetPath + ').');
			console.log('If you have made any changes, be sure to merge into the new file.');
			console.log('');

			shelljs.mv(srcPath, targetPath);

			return this.copySources();
		}
	}

	copySources() {
		var gradleFile = path.join(__dirname, 'src', 'android', 'build.gradle'),
			targetDir = path.join(this.projectDir, 'src', 'android'),
			tempFolder = path.join(os.tmpdir(), 'cloudbridge-' + new Date().getTime());

		shelljs.mkdir('-p', tempFolder);
		shelljs.cp(gradleFile, tempFolder);

		utils.copyTemplate(tempFolder, targetDir, {
			project: this.projectData
		}, /\.gradle/);

		shelljs.rm('-rf', tempFolder);

		return Q();
	}
}
