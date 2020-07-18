const express = require("express");
const app = express();
const path = path();
app.use(express.static(__dirname + '/dist'));
app.listen(process.env.PORT || 54988);
 //PathLocationStrategie
app.get('/*', function (req, res) {
res.sendFile(path.join(__dirname + '/dist/index.html'));
})
console.log('im running');
