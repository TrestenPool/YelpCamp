module.exports = func => {
  return (req, res, next) => {
    func(req, res, next)  
      .then(res => {
        // do nothing
      })
      .catch( (error) => {
        next(error);
      })
  }
}