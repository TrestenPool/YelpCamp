const mongoose = require('mongoose');
const BaseJoi = require('joi');
const campground = require('../models/campground');
// HTML sanitization
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value){
                  return helpers.error('string.escapeHTML', { value })
                } 
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

/** Campground Schema **/
module.exports.campgroundSchema = 
  Joi.object({
    location: Joi.string()
      .required(),

    description: Joi.string()
      .required(),

    title: Joi.string()
      .required().escapeHTML(),

    price: Joi.number()
      .required()
      .min(0),

    images: Joi.array()
      .items({
        url: Joi.string().required(),
        filename: Joi.string().required(),
      })

  }).required();



/** Review Schema **/
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    body: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required()
  }).required()
});