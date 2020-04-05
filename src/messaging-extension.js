import * as builder from 'botbuilder';
import * as teamsBuilder from 'botbuilder-teams';
import {connector} from './bot';
import axios from 'axios';
import config from 'config';

export default function setup() {

	const axiosFetch = axios.create({
			baseURL: 'https://api.yelp.com/v3/businesses',
			timeout: 10000,
			headers: { 'Authorization': 'Bearer ' + config.get('yelpApiKey') }
	});

	connector.onQuery('getRandomText', (event, {parameters}, callback) => {

		// Build the data to send
			const attachments = [];
			let businesses = null;

			axiosFetch.get('/search?location=98052&radius=1000&limit=5&categories=restaurants,bars')
			.then(res => {
					const data = res.data;
					businesses = data["businesses"];

					for (let i = 0; i < 5; i++) {
							const business = businesses[i];
							const title = business["name"];
							const categories = business.categories;
							const text = categories.map(cat => cat.title).join('; ');
							const image = business.image_url;
							attachments.push(
									new builder.ThumbnailCard()
											.title(title)
											.text(text)
											.images([new builder.CardImage().url(image)])
											.toAttachment());
					}

					// Build the response to be sent
					const response = teamsBuilder.ComposeExtensionResponse
							.result('list')
							.attachments(attachments)
							.toResponse();

					// Send the response to teams
					callback(null, response, 200);
			})
			.catch(ex => console.log(ex))
	});

}
