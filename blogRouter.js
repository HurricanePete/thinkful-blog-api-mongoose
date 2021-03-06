const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const {Blogs} = require('./models');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

router.get('/', (req, res) => {
	Blogs
		.find()
		.then(blogs => res.json(
			blogs.map(blogs => blogs.blogsRepr())
		))
		.catch(err => {
			console.error(err);
			res.status(500).json({message: 'Internal server error'})
		});
});

router.get('/:id', (req, res) => {
	Blogs
		.findById(req.params.id)
		.exec()
		.then(blogs => res.json(blogs.blogsRepr()))
		.catch(err => {
			console.error(err);
			res.status(500).json({message: 'Internal server error'})
		});
});

router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	};
	Blogs
		.create({
			title: req.body.title,
			content: req.body.content,
			author: {
				firstName: req.body.author.firstName, 
				lastName: req.body.author.lastName
			},
			created: Date.now()
		})
		.then(blogs => res.status(200).json(blogs.blogsRepr()))
		.catch(err => { 
			console.error(err);
			res.status(500).json({message: 'Internal server error'});
		});
});

router.put('/:id', jsonParser, (req, res) => {
	if (!('id' in req.body)) {
		const message = `Please include the id to be updated`;
		console.error(message);
		res.status(400).send(message);
	};
	if (req.params.id !== req.body.id) {
		const message = `The reqested id \`${req.params.id}\` does not match the update request for id \`${req.body.id}\``;
		console.error(message);
		return res.status(400).send(message);
	};
	console.log(`Updating blog ID: \`${req.params.id}\``);

	const toUpdate = {};
  	const updateableFields = ['title', 'content', 'author'];
  	//how can I keep a value for author if I only update firstName or lastName, but not both?

 	updateableFields.forEach(field => {
   		if (field in req.body) {
      	toUpdate[field] = req.body[field];
    	}
  	});
 	Blogs
 		.findByIdAndUpdate(req.params.id, {$set: toUpdate})
 		.exec()
 		.then(blogs => res.status(200).json(blogs.blogsRepr()))
 		.catch(err => {
 			console.error(err);
 			res.status(500).json({message: 'Internal server error'});
 		});
});

router.delete('/:id', (req, res) => {
	Blogs
		.findByIdAndRemove(req.params.id)
		.exec()
		.then(blogs => {
			console.log(`Deleted blog post with ID: \`${req.params.id}\``);
			res.status(204).end();
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({message: 'Internal server error'});
		})
});



module.exports = router;