// campground object
const Campground = require('../models/campground');

/** Index function **/
module.exports.index = async (req, res) => {
  // get the campgrounds in ascending order
  const campgrounds = await Campground.find({}).sort({ title: "ascending" })

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

module.exports.handleNewCampground = async (req, res, next) => {
  // make a new campground object
  let campground = new Campground(req.body.campground);

  // save the newly created images to the campground object
  campground.images = req.files.map(f => f.path);
  
  // add the author to the campground
  campground.author = req.user._id;

  // save the campground in the db
  campground = await campground.save();
  
  // redirect to the show page 
  req.flash('success', 'Successfully created a new campground');
  res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.handleEditCampground = async (req, res, next) => {
  // get the campground id from the url parameters
  const { id } = req.params;

  // TODO: 
  res.send(req.body.campground);

  // remove all empty values from the images array
  // let filtered = req.body.campground.images.filter(n => n);
  // req.body.campground.images = filtered;

  // // update the campground in the db
  // // const campground = await Campground.findByIdAndUpdate({ _id: id }, { ...req.body.campground }, { runValidators: true, returnOriginal: false });

  // // campground was successfully updated
  // req.flash('success', 'Successfully updated the campground');

  // // redirect to the show page for the campground
  // res.redirect(`/campgrounds/${id}`);
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
