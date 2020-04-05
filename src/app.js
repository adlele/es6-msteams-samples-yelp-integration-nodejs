'use strict';
import messagingExtension from './messaging-extension';
import bot from './bot';
import tabs from './tabs';


var express = require('express');
var app = express();

// Adding tabs to our app. This will setup routes to various views
tabs(app);

// Adding a bot to our app
bot.setup(app);

// Adding a messaging extension to our app
messagingExtension();

// Deciding which port to use
var port = process.env.PORT || 3333;

// Start our nodejs app
app.listen(port, function() {
    console.log(`App started listening on port ${port}`);
});
