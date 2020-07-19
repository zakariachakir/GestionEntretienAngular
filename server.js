const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(__dirname + '/dist/stock'));
app.use(function (req, res , next) {
  if(!req.secure) {
    return res.redirect('https://' + req.headers.host + req.path);
  }
next();
 } );
app.get('/*', function (req, res) {
  if(!req.secure){
    return res.redirect('https://' + req.headers.host + req.path);
  }
res.sendFile(path.join(__dirname + '/dist/stock/index.html'));

});
app.listen(process.env.PORT || 24942);
console.log('im running');
