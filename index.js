const express = require('express');
const cors = require("cors")
const port = 8080;
const path = require('path');
const fs = require("fs"); 

const app = express();

const whitelist = ["http://localhost:3000"]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions))
app.use(express.urlencoded({extended:false}));


console.log('__dirname ', __dirname);
const indexPath  = path.resolve(__dirname, 'index.html');
console.log('indexPath ', indexPath);

app.get('/', function(req,res) {
    console.log("res.body.url", req.body.url);
    console.log("res.query.url", req.query);
    fs.readFile(indexPath, 'utf8', (err, htmlData) => {
        if (err) {
            console.error('Error during file reading', err);
            return res.status(404).end()
        }
        // get post info
        const url = req.query.url;
        
        htmlData = htmlData.replace(
            `<meta property="og:image" content="https://picsum.photos/250/250">`,
            `<meta property="og:image" content="${url}">`
        )
        .replace(
            `<img src="" />`,
            `<img src="${url}" />`);


        console.log("htmlData", htmlData)     ;
        // TODO inject meta tags
        res.send(htmlData);

    });

    //res.send('<h1>Server is running<h1>');
})

// app.get('/', function(req,res) {
//     console.log("res.body.url", req.body.url);
//     console.log("res.query.url", req.query);

//     res.send('<h1>Server is running<h1>');
//     //res.send(htmlData);
// })

app.listen(port, function(err) {
    if ( err) {
        console.log('Error in running the server', err);
    }
    console.log('Express Server is running on Port : ', port);

})

