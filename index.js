const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config();
const routes = require('./routes/main')
// const cors = require('cors')

const app = express()

// app.use(cors())


app.use(bodyParser.json()); 
app.use(express.static(path.join(__dirname, "client")));
-app.get('/', function (req, res) {
+app.get('/*', function (req, res) { 
  res.sendFile(path.join(__dirname, "client", "index.html"));
})
})


app.use('/main', routes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

const PORT = process.env.PORT || 3001
try {
    app.listen(PORT, () => {
        console.log('Mixing it up on port ' + PORT)
    })
} catch (err) {
    console.log(err)
}