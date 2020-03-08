const { join } = require('path');
const Hapi = require('@hapi/hapi');

const VOTES_FILE_PATH = join(__dirname, './votes-status.json');

const votesStatus = require(VOTES_FILE_PATH);

const init = async () => {
	const server = Hapi.server({
		port: process.env.PORT || 4444
	});
	// request.params
	// request.query
	// request.payload
	// handler: (request, helpers) => {}

	server.route({
		method: 'GET',
		path: '/api/dj',
		handler: () => {
			return { votesStatus };
		}
	});

	server.route({
		method: ['GET', 'POST'],
		path: '/api/dj/{djId}/vote',
		handler: (request) => {
			const djIndex = votesStatus.findIndex(dj => dj.id == request.params.djId);
			if (djIndex !== -1) {
				votesStatus[djIndex].votesCount++;				
			}
			return { votesStatus };
		}
	});

	await server.start();
	console.log(`Server running on ${server.info.uri}`);
}

process.on('unhandledRejection', err => {
	console.log(err);
	process.exit(1);
});

init();
