// Welcome Page
exports.index_get_index = (req, res) => res.render('welcome');

// Dashboard
exports.index_get_dashboard = (req, res) => {
  if (req.user.type === "applicant") {
    if (Object.entries(req.user.userInfo).length === 0) {
      res.render('dashboard/applicantForm', {
        user: req.user
      });
    } else {
      res.render('dashboard/applicantDashboard', {
        user: req.user
      });
    }
  } else if (req.user.type === "employer") {
    if (Object.entries(req.user.userInfo).length === 0) {
      res.render('dashboard/employerForm', {
        user: req.user
      });
    } else {
      res.render('dashboard/employerDashboard', {
        user: req.user
      });
    }
  } else {
    res.render('dashboard/userTypeSelect', {
      user: req.user
    });
  }
};
