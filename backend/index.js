// import express
const express = require('express');
var bodyParser = require('body-parser');

const userRouter = require('./Routers/userRouter');
const blogRouter = require('./Routers/blogRouter');
const utilRouter = require('./Routers/utils');

const cors = require('cors');

// initialize express
const app = express();
const port = 5000;

// middlewares
app.use(cors());
app.use(bodyParser.urlencoded({limit: '20mb', extended: true}));
app.use(express.json({limit: '20mb'}));
app.use(cors({
    origin: [ 'http://localhost:3000']
}));

app.use('/user', userRouter);
app.use('/blog', blogRouter);
app.use('/utils', utilRouter);

// Routes

app.get('/', (req, res) => {
    res.send('Response from Express')
});

app.get('/home', (req, res) => {
    res.send("Response from Home");
});

app.get('/add', (req, res) => {
    res.send("Response from Add");
});

app.get('/getall', (req, res) => {
    res.send("Response from GetAll");
});


// home
// add
// getall

// starting the server 
app.listen( port, () => { console.log('express server started') } );

