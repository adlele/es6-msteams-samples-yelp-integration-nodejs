import path from 'path';
import express from 'express';

export default function setup(app) {

	// Configure the view engine, views folder and the statics path
	app.use(express.static(path.join(__dirname, 'static')));
	app.set('view engine', 'pug');
	app.set('views', path.join(__dirname, 'views'));

	// Setup home page
	app.get('/', (req, res) => {
			res.render('hello');
	});

	// Setup the static tab
	app.get('/hello', (req, res) => {
			res.render('hello');
	});

	// Setup the configure tab, with first and second as content tabs
	app.get('/configure', (req, res) => {
			res.render('configure');
	});

	app.get('/first', (req, res) => {
			res.render('first');
	});

	app.get('/second', (req, res) => {
			res.render('second');
	});
}
