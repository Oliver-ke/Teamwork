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
