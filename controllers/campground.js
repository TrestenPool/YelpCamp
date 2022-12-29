// campground object
const Campground = require('../models/campground');
const {deleteFile} = require('../cloudinary/index');
const { createReview } = require('./review');

// mapbox 
const mbxClient = require('@mapbox/mapbox-sdk');
const mabBoxToken = process.env.MAPBOX_TOKEN;
const baseClient = mbxClient({ accessToken: mabBoxToken });
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder = mbxGeocoding(baseClient);

/** Index function **/
module.exports.index = async (req, res) => {
  // get the campgrounds in ascending order
  let campgrounds = await Campground.find({}).sort({ title: "ascending" })

  // no campgrounds were found
  if (!campgrounds) {
    campgrounds = {};
    res.render('campgrounds/index', { campgrounds });
  }
  // pass the campgrounds that were found to the view to render
  else {
    res.render('campgrounds/index', { campgrounds });
  }

}

/* Render new campground form */
module.exports.renderNewForm = (req, res) => {
  res.render('campgrounds/new');
}

/* Render campground edit form */
module.exports.renderEditForm = (async (req, res, next) => {
  // get the id for the campground
  const { id } = req.params;

  // get the campground from the db
  const camp = await Campground.findById({ _id: id })

  // campground does not exist
  if (!camp) {
    return next(new ExpressError(`The ID:${id} was not found...`), 400);
  }
  else {
    // render the edit page for the campground
    res.render('campgrounds/edit', { camp })
  }
})

/* Render campground show page */
module.exports.renderShowPage = async (req, res, next) => {
  // grab the campground id from the url
  const { id } = req.params;

  // search for the camp in the db
  const camp = await Campground.findById({ _id: id })
  .populate({
    path: 'reviews',
    populate: {
      path: 'author',
      model: 'User'
    }
  })
  .populate('author');

  // campground was not found 
  if (!camp) {
    // throw new ExpressError(`The campground with ID: ${id} was not found`);
    req.flash('error', `Campground of ID:${id} was not found.`);

    // redirect to the index page
    res.redirect('/campgrounds');
  }
  // campground found
  else {
    // grab the reviews for the campground to pass to the view
    const {reviews} = camp;

    // render the show page
    res.render('campgrounds/show', { camp, reviews});
  }
}

/* Create a new campgrond */
module.exports.handleNewCampground = async (req, res, next) => {
  // make a new campground object
  let campground = new Campground(req.body.campground);

  // append the newly created files to the campground.images object array
  req.files.forEach( (file) => {
    campground.images.push({
      "url": file['path'],
      "filename": file['originalname']
    })
  })

  // add the author to the campground
  campground.author = req.user._id;

  // add the location to the campground
  const geoData = await geocoder.forwardGeocode(
    {
      query: campground.location,
      limit: 1
    }
  ).send()

  // Assign the campground location to the GeoJson
  campground.geometry = geoData.body.features[0].geometry;

  // save the campground in the db
  campground = await campground.save();
  
  // redirect to the show page 
  req.flash('success', 'Successfully created a new campground');
  res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.handleEditCampground = async (req, res, next) => {
  // get the campground id from the url
  const { id } = req.params;

  // There are no images
  if('images' in req.body.campground === false){
    req.body.campground.images = []
  }

  // Add the images the user has added to the campground images array
  if(req.files.length >= 1){
    newFilesArray = [];
    req.files.forEach((file) => {
      newFilesArray.push({"url":file['path'] , "filename": file['originalname']});
    })
    req.body.campground.images = req.body.campground.images.concat(newFilesArray);
  }

  // get the original images from the campground
  let originalCampground = await Campground.findById({_id: id});
  let originalImages = originalCampground.images;

  let allCampgroundImageUrls = req.body.campground.images.map(imgObject => imgObject['url']);

  // see if any of the original images have been deleted, if it has been deleted, it will be deleted in cloudinary as well
  for(ogImage of originalImages){
    if( allCampgroundImageUrls.includes(ogImage['url']) == false ){
      console.log(`Handle edit controller Deleting: ${ogImage}`);
      deleteFile(ogImage);
    }
  }

  // update the campground in the db
  const campground = await Campground.findByIdAndUpdate({ _id: id }, { ...req.body.campground }, { runValidators: true, returnOriginal: false });

  // campground was successfully updated
  req.flash('success', 'Successfully updated the campground');

  // redirect to the show page for the campground
  res.redirect(`/campgrounds/${id}`);
}


module.exports.handleDeleteCampground = async (req, res) => {
  // get the id from the url parameters
  const { id } = req.params;

  // attempts to delete by the id
  const camp = await Campground.findByIdAndDelete({ _id: id });

  // camp was not found
  if (!camp) {
    req.flash('error', `Error deleting campground with ID: ${id}`);
  }
  else {
    req.flash('success', `Successfully deleted ${camp.title}`);
  }

  // redirect to the index page
  res.redirect('/campgrounds'); 

}
