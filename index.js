const express = require('express');
const app = express();
const ejs = require('ejs');
const mongoose = require('mongoose');
const expressSession = require('express-session');
const flash = require('connect-flash');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const axios = require('axios');
const qr = require('qrcode');
const multer  = require('multer');

mongoose.connect('mongodb+srv://admin:1234@users1.91wy4gi.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true
});

global.loggedIn = null;

/// controllers
const Homenologin = require('./controllers/HomeNOloginCON');
const login = require('./controllers/loginCON');
const register = require('./controllers/registerCON');
const storeCON = require('./controllers/storeUser');
const Home = require('./controllers/HomeCON');
const loginsystem = require('./controllers/loginUserCON');
const logout = require('./controllers/logout');
const admin = require('./controllers/admin');
const qrcode = require('./controllers/qrcode');
const addpoint = require('./controllers/addpoint');
const adminn = require('./controllers/adminn');
const delqr = require('./controllers/delQR');
const genqrmiddl = require('./middleware/genqrmiddleware');
const delqrmiddl = require('./middleware/delqrmiddleware');
const Urlgen = require('./qrcodeGEN');
const pofile = require('./controllers/pofile');
///
port = process.env.PORT || 4000;
//Middleware

const redire = require('./middleware/readire')
const redirenouser = require('./middleware/readireNouser');
const { error } = require('console');

app.use(express.static('public'));
app.use('/public/', express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(cookieParser());

app.use(expressSession({
    secret: "node secret",
    resave: false,
    saveUninitialized: true,
}))

app.use("*" , (req,res,next)=>{
    loggedIn = req.session.userId;
    next()
})

app.use((req, res, next) => {
  const userCookie = req.cookies.user;

  // Attach user information to the request object
  req.user = userCookie || null;

  next();
});

////set timeout baby
const timeoutMiddleware = (req, res, next) => {
  const timeout = 5000;
  req.setTimeout(timeout);
  res.setTimeout(timeout);
  next();
};

app.set('view engine' , 'ejs');
app.get('/About',redirenouser,Homenologin,(req, res) => {
  const user = req.user;
  if (user) {
      res.send(`Welcome back, ${user.email}!`);
  } else {
      res.send('Welcome to the website!');
  }
});
app.get('/',redirenouser,Home,(req, res) => {
  const user = req.user;
  if (user) {
      res.send(`Welcome back, ${user.email}!`);
  } else {
      res.send('Welcome to the website!');
  }
});
app.get('/Home',redirenouser,Home,(req, res) => {
  const user = req.user;
  if (user) {
      res.send(`Welcome back, ${user.email}!`);
  } else {
      res.send('Welcome to the website!');
  }
});
app.get('/pofile',redirenouser,pofile,(req, res) => {
  const user = req.user;
  if (user) {
      res.send(`Welcome back, ${user.email}!`);
  } else {
      res.send('Welcome to the website!');
  }
});

app.get('/login',redire,login , (req,res)=>{
  const { email,password } = req.body;
  res.cookie('user', {email});
  res.send('Login successful');
});
app.get('/register',redire,register,);
app.post('/user/register',redire,storeCON);
app.post('/user/login',redire,loginsystem);
app.post('/logout',logout)
app.get('/admin',redirenouser,genqrmiddl,admin,(req, res) => {
  const user = req.user;
  if (user) {
      res.send(`Welcome back, ${user.email}!`);
  } else {
      res.send('Welcome to the website!');
  }
});

app.post('/getpoint',timeoutMiddleware,qrcode,timeoutMiddleware,adminn,(req, res) => {
  const user = req.user;
  if (user) {
      res.send(`Welcome back, ${user.email}!`);
  } else {
      res.send('Welcome to the website!');
  }
});

/////////////////////////////////////////////////////////////url//////////////////////////////////////////////////////
app.post('/dtqrcode' ,delqr,timeoutMiddleware,admin);
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
(async () => {
    try {
      const data = await readFileAsync("URL.json");
      const URL = JSON.parse(data);
      console.log(URL.URL);
      app.get('/adminn',redirenouser,delqrmiddl,(req, res) => {
        qr.toDataURL(URL.URL,(err,qrCodeurl)=>{
          if(err){
            res.status(500).send('Error888 Vip');
          }
          else{
            res.render('adminn');
          }
        });
        });
      app.get('/KF89KSDsd5S',addpoint,(req, res) => {
        const user = req.user;
        if (user) {
            res.send(`Welcome back, ${user.email}!`);
        } else {
            res.send('Welcome to the website!');
        }
      });
    } catch (error) {
      console.error(`Error reading URL.json: ${error}`);
    }
  })();

/////////////////////////////////upload pofile //////////////////////////////////////////////
const User = require('./models/User');
const storage = multer.diskStorage({
  
  destination: function (req, file, cb) {
    cb(null, 'public/img/pofileUser_img/')
  },
  filename: async function (req, file, cb) {
    const userData = await User.findById(req.session.userId);
    cb(null,file.originalname);
    userData.avata = `../public/img/pofileUser_img/${'filename:',file.originalname}` 
    await userData.save();
    console.log('filename:',file.originalname)
  }
})

const upload = multer({ storage: storage })


app.post('/profile/upload',upload.single('avatar'),(req,res)=>{
  console.log('uploadPofile successfully!');
  res.redirect('/');
})

//////////////////////////////////////////////////////////////////////////////////////////////


app.listen(port, () => {
console.log("Web run on port : " ,port);
});