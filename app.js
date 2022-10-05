import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import {fileURLToPath} from 'url';
import path from 'path';


// **For all this to start use mongod with mongosh activated, along with using
//   postman for api testing

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
let port = process.env.PORT;
const greet = process.env.GREET;
const url = process.env.URI;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

await mongoose.connect(url);

const wikiSchema = new mongoose.Schema({
  title: {type: String, required: [true, "Must add title"]},
  content: String
});

const Articles = mongoose.model('Article', wikiSchema);

/////////////////// Requests Targeting All Articles/////////////////////////

// *** We are chaining routes here
app.route("/articles")
  .get((req, res)=>{
    Articles.find((err, foundArticles)=>{
      if (!err){
        res.send(foundArticles);
      } else {
        res.send(err);
      }

    })
  })
  .post((req, res)=>{
    // Here we are using postman to send a post request to the url of localhost/articles
        // and testing if the request to send data that was submitted into the db
        // and using the function call in the save method we can respond with respose call
        // that the item has been saved or not due to an error
    // console.log(req.body.title);
    // console.log(req.body.content);
    const newArticle = new Articles({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save((err)=>{
      if (!err){
        res.send("Successfully added a new article.")
      } else {
        res.send(err)
      }
    });

  })
  .delete((req, res)=>{
    // Each mongoose specific method such as find(), delete(), findOne(), deleteOne() etc
      // will usually take a condition and function parameter. However if we leave out the
      // condition on which the method should run then it will run for the entire Model specified.
      // ** Here calling deleteMany without a condition parameter will delete all items/records in the
        // specified Model.
    Articles.deleteMany((err)=>{
      if (!err) {
        res.send("Successfully deleted all articles")
      } else {
        res.send(err)
      }
    });
  });

/////////////////// Requests Targeting A Specific Article/////////////////////////

app.route('/articles/:articleTitle')
  .get((req,res)=>{
    Articles.findOne({title: req.params.articleTitle}, (err, foundArticle)=>{
      if (foundArticle){
        res.send(foundArticle)
      } else {
        res.send("No articles matching that title was found.")
      }
    })

  })
  .put((req, res)=>{
    // for updateOne(filter, update, options, callback), here there are no options
    Articles.updateOne(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      (err)=>{
        if (!err) {
          res.send("Successfully updated article.")
        } else {
          res.send(err)
        }
      }
    )
  })
  .patch((req, res)=>{
    Articles.updateOne(
      {title: req.params.articleTitle},
      req.body,
      (err)=>{
        if (!err) {
          res.send("Successfully updated single article.")
        } else {
          res.send(err)
        }
      }
    )
  })
  .delete((req, res)=>{
    Articles.deleteOne({title: req.params.articleTitle}, (err)=>{
      if (!err){
        if (!err) {
          res.send("Successfully deleted single article.")
        } else {
          res.send(err)
        }
      }
    })
  });


// const article = new Articles ({
//   title: "REST",
//   content:'REST is short for REpresentational State Transfer. It\'s an architectural style for designing APIs.',
// });
// const article1 = new Articles ({
//   title: "API",
//   content:'API stands for Application Programming Interface. It is a set of subroutine definitions, communication protocols, and tools for building software. In general terms, it is a set of clearly defined methods of communication among various components.',
// });
// const article2 = new Articles ({
//   title: "Bootstrap",
//   content:'This is a framework developed by Twitter that contains pre-made front-end templates for web design',
// });
// const article3 = new Articles ({
//   title: "DOM",
//   content:'The Document Object Model is like on API for interacting with our HTML',
// });
//
// Articles.insertMany([article,article1,article2,article3], function(err){
//   if (err){
//     conosle.log(err)
//     return
//   }
//   console.log("Successfully saved all articles to Articles")
// });

app.get('/', (req,res)=>{
  res.send(greet)
})

if (port == null || port == "") {
  port = 5000;
}

app.listen(port, () => {
  console.log(`Server has started`);
});
