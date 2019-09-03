// Welcome Page
exports.index_get_index = (req, res) => res.render('welcome');

// Dashboard
exports.index_get_dashboard = (req, res) => {
  res.render('dashboard', {
    user: req.user
  });
};
