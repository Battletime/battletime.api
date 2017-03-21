var exphbs  = require('express-handlebars');

module.exports = function(app){
    //handlebars
    app.engine('.hbs', exphbs({
        extname: '.hbs', 
        defaultLayout: 'main', 
        helpers: {
            toJson: (obj) => {return JSON.stringify(obj, null, 3)},
        }
    }));

    app.set('view engine', '.hbs');
}