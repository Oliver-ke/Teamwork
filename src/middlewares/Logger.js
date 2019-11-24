// this is a debugging stractegy i used to check request from auto gradr to
// my app on heroku console.

export default (req, res, next) => {
  const time = new Date().toLocaleTimeString();
  const detail = {
    url: req.url,
    method: req.method,
  };
  console.log(detail);
  console.log(req.body, time);
  next();
};
