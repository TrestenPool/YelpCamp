const ExpressError = require('./ExpressError');
const { campgroundSchema, reviewSchema } = require('./schemas');



/**********************************/
/********** JOI VALIDATION ********/
/**********************************/
const validateCampground = (req, res, next) => {
  // attemmpt to validate with the schema
  const { error } = campgroundSchema.validate(req.body);

  // there was an error in validation
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400);
  }
  // there was not an error in validation
  else {
    next();
  }
}

const validateReview = (req, res, next) => {
  // validate here
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400);
  }
  else {
    next();
  }
}


module.exports = {
  validateCampground, validateReview
};