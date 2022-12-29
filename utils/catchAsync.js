// this function will return an arrow function. 
// the arrow function where it will call the function that was passed with all the req,res parameters
// The point is to catch if any errors are thrown
module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next)  

      // nothing happens if it is successful
      .then(res => {
      })

      // it will catch and pass that error on if something went wrong
      .catch( (error) => {
        next(error);
      })
  }
}