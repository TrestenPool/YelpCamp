const mongoose = require('mongoose');
const Joi = require('joi');
const campground = require('../models/campground');

/** Campground Schema **/
module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({

    location: Joi.string()
      .required(),

    description: Joi.string()
      .required(),

    title: Joi.string()
      .required(),

    price: Joi.number()
      .required()
      .min(0),

    images: Joi.array()

  }).required(),
});

/** Review Schema **/
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    body: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required()
  }).required()
});