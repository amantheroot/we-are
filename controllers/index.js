// Welcome Page
exports.index_get_index = (req, res) => res.render('welcome');

// Dashboard
exports.index_get_dashboard = (req, res) => {
  if (req.user.type === "applicant") {
    res.render('applicantDashboard', {
      user: req.user
    });
  } else if (req.user.type === "employer") {
    res.render('employerDashboard', {
      user: req.user
    });
  } else {
    res.render('userTypeSelect', {
      user: req.user
    });
  }
};
