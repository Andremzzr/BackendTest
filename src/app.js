require('dotenv').config();
const express = require('express');
const database = require('./database/database');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

const urlencodeParser = bodyParser.urlencoded({extended: false});

database
.then(() => console.log('Conected to MongoDb'));

const linkRoute = require('./routes/link');
const formRoute = require('./routes/form');



//SET VIEWS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));

// SET URL PARSER
app.use(urlencodeParser);


//SETTING ROUTES
app.use('/link',linkRoute);
app.use('/form',formRoute)

app.get('/', (req,res) => {
    res.render('home')
})

app.listen(process.env.PORT || 5000, () => console.log(`Server online, on the port ${process.env.PORT || 5000}`));