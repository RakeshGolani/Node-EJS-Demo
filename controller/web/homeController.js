

class HomeController 
{
  static home(req, res) 
    {
        res.render('web/home', {
            layout:false,
            title: 'Home',
            errors: {},
        });
    }
}

module.exports = HomeController;