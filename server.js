const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const path = require('path');
const db = require('./db');
nunjucks.configure({noCache:true});

app.set('view engine', 'html');
app.engine('html', nunjucks.render);

app.use('/vendor', express.static(path.join(__dirname, 'node_modules')));

app.use((req,res,next)=>{
  res.locals.path = req.url;
  next();
})

app.get('/', (req,res,next)=>{
    res.render('index', {title: 'Twitter'})
});

app.use('/tweets', require('./routes/tweets'));

db.sync((err)=> { if(err) return console.log(err)});

db.seed((err,tweets)=>{ if(err) return console.log(err)});


const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`listening on ${port}`));
