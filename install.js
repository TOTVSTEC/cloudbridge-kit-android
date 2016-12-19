var path = require('path'),
	Q = null,
	shelljs = null,
	utils = null,
	prompt = null;

class InstallTask {

	constructor(cli, targetPath, projectData) {
		this.cli = cli;
		this.projectDir = targetPath;
		this.projectData = projectData;

		Q = cli.require('q');
		shelljs = cli.require('shelljs');
		prompt = cli.require('prompt');
		utils = cli.utils;
	}

	run() {
		var self = this;

		return Q()
			.then(function() {
				return self.checkForExistingFiles();
			})
			.then(function(result) {
				var promise = null;

				if (result.overwrite) {
					promise = self.deleteSources();
				}
				else if (result.rename) {
					promise = self.renameSources();
				}

				if (promise !== null) {
					return promise.then(function() {
						self.copySources();
					});
				}
			})
			.then(function() {
				var restoreTask = require('./restore');

				return restoreTask.run(this.cli, this.projectDir);
			});
	}

	copySources() {
		var src = path.join(__dirname, 'src'),
			target = path.join(this.projectDir, 'src'),
			extensions = /\.(gradle|xml|java)/,
			packagePath;

		utils.copyTemplate(src, target, {
			project: this.projectData
		}, extensions);

		src = path.join(this.projectDir, 'src', 'android', 'java');
		packagePath = path.join.apply(path, this.projectData.id.split('.'));
		target = path.join(src, packagePath);

		shelljs.mkdir('-p', target);

		var files = shelljs.ls(path.join(src, '*.java'));

		for (var i = 0; i < files.length; i++) {
			var targetFile = path.join(target, this.projectData.name + path.basename(files[i]));

			shelljs.mv(files[i], targetFile);
		}
	}

	checkForExistingFiles() {
		var q = Q.defer();
		var targetPath = path.join(this.projectDir, 'src', 'android');

		console.log('The directory'.error.bold, targetPath, 'already exists.'.error.bold);
		console.log('Would you like to overwrite the directory with this new project?');

		var options = {
			properties: {
				areYouSure: {
					name: 'areYouSure',
					description: '(yes/no):'.yellow.bold,
					required: true
				}
			}
		};

		//prompt.override = _argv;
		prompt.message = '';
		prompt.delimiter = '';
		prompt.start();

		prompt.get({ properties: promptProperties }, function(err, promptResult) {
			if (err && err.message !== 'canceled') {
				q.reject(err);

				return console.error(err);
			}
			else if (err && err.message == 'canceled') {
				return q.resolve(false);
			}

			var areYouSure = promptResult.areYouSure.toLowerCase().trim();
			if (areYouSure == 'yes' || areYouSure == 'y') {
				shelljs.rm('-rf', targetPath);

				q.resolve(true);
			}
			else {
				q.resolve(false);
			}
		});


		return q.promise;
	}
}

module.exports = InstallTask;
