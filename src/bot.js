import * as builder from 'botbuilder';
import * as teams from 'botbuilder-teams';
import config from 'config';

var connector;

export default class Echobot {
	static setup(app) {

		if (!config.has("bot.appId")) {
			// We are running locally; fix up the location of the config directory and re-intialize config
			process.env.NODE_CONFIG_DIR = "../config";
			delete require.cache[require.resolve('config')];
			config = require('config');
		}
		// Create a connector to handle the conversations
		connector = new teams.TeamsChatConnector({
			// It is a bad idea to store secrets in config files. We try to read the settings from
			// the config file (/config/default.json) OR then environment variables.
			// See node config module (https://www.npmjs.com/package/config) on how to create config files for your Node.js environment.
			appId: config.get("bot.appId"),
			appPassword: config.get("bot.appPassword")
		});

		const inMemoryBotStorage = new builder.MemoryBotStorage();

		// Define a simple bot with the above connector that echoes what it received
		const bot = new builder.UniversalBot(connector, session => {
			// Message might contain @mentions which we would like to strip off in the response
			const text = teams.TeamsMessage.getTextWithoutMentions(session.message);
			session.send('You said: %s', text);
		}).set('storage', inMemoryBotStorage);

		// Setup an endpoint on the router for the bot to listen.
		// NOTE: This endpoint cannot be changed and must be api/messages
		app.post('/api/messages', connector.listen());
	}
}

export {connector}



// export default function setup(app) {
//     const builder = require('botbuilder');
//     const teams = require('botbuilder-teams');
//     let config = require('config');

//     if (!config.has("bot.appId")) {
//         // We are running locally; fix up the location of the config directory and re-intialize config
//         process.env.NODE_CONFIG_DIR = "../config";
//         delete require.cache[require.resolve('config')];
//         config = require('config');
//     }
//     // Create a connector to handle the conversations
//     const connector = new teams.TeamsChatConnector({
//         // It is a bad idea to store secrets in config files. We try to read the settings from
//         // the config file (/config/default.json) OR then environment variables.
//         // See node config module (https://www.npmjs.com/package/config) on how to create config files for your Node.js environment.
//         appId: config.get("bot.appId"),
//         appPassword: config.get("bot.appPassword")
//     });

//     const inMemoryBotStorage = new builder.MemoryBotStorage();

//     // Define a simple bot with the above connector that echoes what it received
//     const bot = new builder.UniversalBot(connector, session => {
//         // Message might contain @mentions which we would like to strip off in the response
//         const text = teams.TeamsMessage.getTextWithoutMentions(session.message);
//         session.send('You said: %s', text);
//     }).set('storage', inMemoryBotStorage);

//     // Setup an endpoint on the router for the bot to listen.
//     // NOTE: This endpoint cannot be changed and must be api/messages
//     app.post('/api/messages', connector.listen());

//     // Export the connector for any downstream integration - e.g. registering a messaging extension
//     export {connector}
// }

