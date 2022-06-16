const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const path = require('path');
const exphbs = require('express-handlebars');
const helpers = require('./utils/helpers');
const hbs = exphbs.create({ helpers });
const app = express();
const PORT = process.env.PORT || 3001;
const session = require('express-session');

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
    secret: 'Super secret secret',
    cookie: { maxAge: 1 * 60 * 60 * 1000 }, // 1 hours
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};



app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(session(sess));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);


sequelize.sync({ force: false })
    .then(() => {
        app.listen(PORT, () => console.log(`Now listening on the port: 🌎 http://localhost:${PORT} 🌎`))
    });