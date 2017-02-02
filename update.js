var task = module.exports,
	Q = null;

task.run = function run(cli, targetPath, projectData) {
	Q = cli.require('q');

	return Q()
		.then(function() {
			var remove = require('./remove');

			return remove.run(cli, targetPath, projectData);
		})
		.then(function() {
			var restoreTask = require('./restore');

			return restoreTask.run(cli, targetPath, projectData);
		});
};
