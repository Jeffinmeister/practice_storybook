const express = require("express")
const path = require('path')
const mongoose = require('mongoose')
const dotenv = require("dotenv")
const methodOverride = require("method-override")
const connectDB  = require("./config/db")
const morgan = require("morgan")
var exphbs  = require('express-handlebars');
const { static } = require("express")
const passport = require('passport')
const session = require("express-session")
const MongoStore = require('connect-mongo')(session)



//load config
dotenv.config({path: './config/config.env'})


//passport config
require('./config/passport')(passport)

//connect db
connectDB()

const app = express()


//bodyParser middleware
app.use(express.urlencoded({extended:false}))
app.use(express.json())


//method-override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))


//add morgan
if(process.env.NODE_ENV ==="developement") {
    app.use(morgan('dev'))
}

//Handlebars Helper
const{formatDate,stripTags,truncate,editIcon,select} = require('./helpers/hbs')

//Handlebars
app.engine('.hbs', exphbs({helpers:{
  formatDate,
  truncate,
  stripTags,
  editIcon,
  select
},
defaultLayout:'main',extname: '.hbs'}));
app.set('view engine', '.hbs');

//Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
  }))

//passport middleware
app.use(passport.initialize())
app.use(passport.session())


//Set Global Variable
app.use(function(req,res,next) {
  res.locals.user = req.user ||null
  next()
})


//static Folder
app.use(express.static(path.join(__dirname,'public')))


//Routes
app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))
app.use('/stories',require('./routes/stories'))

//set port
const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running  in ${process.env.NODE_ENV} mode on port ${PORT}`))


