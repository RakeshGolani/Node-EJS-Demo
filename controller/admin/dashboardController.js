const renderPage = require('../../utils/render');

class DashboardController 
{
  static index(req, res) 
    {
        renderPage(res, 'dashboard', { 
        currentRoute: '/admin/dashboard',
        title: req.__('Dashboard'),
        breadcrumb: [],
        addNewButton: false,
        errors: {},
        error: null,
        });
    }
}

module.exports = DashboardController;