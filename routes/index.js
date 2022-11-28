var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose()

/* GET home page. */

router.get('/', function (req, res, next) {
  var db = new sqlite3.Database('myBlog.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      //Query if the table exists if not lets create it on the fly!
      db.all(`SELECT name FROM sqlite_master WHERE type='table' AND name='blog'`,
      
        (err, rows) => {
          if (rows.length === 1) {
            //console.log("Table exists!");
            db.all(` select blog_id, blog_title, blog_txt from blog`, (err, rows) => {
              console.log("returning " + rows.length + " records");
              res.render('index', { title: 'Express', data: rows });
            });
          } else {
            console.log("Creating table and inserting some sample data");
            db.exec(`create table blog (
                     blog_id INTEGER PRIMARY KEY AUTOINCREMENT,
                     blog_title VARCHAR(30),
                     blog_txt text NOT NULL);

                      insert into blog (blog_txt, blog_title)
                      values ('This is my first blog', 'My first blog);`,
              () => {
                db.all(`select blog_id, blog_title, blog_txt from blog`, (err, rows) => {
                  res.render('index', { title: 'Express', data: rows });
                });
              });
          }
        });
    });
});

router.post('/add', (req, res, next) => {
  console.log("Adding blog to database");
  var db = new sqlite3.Database('myBlog.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      console.log("inserting " + req.body.blog + req.body.blog_title);
      //NOTE: This is dangerous! you need to sanitize input from the user
      //this is ripe for a exploit! DO NOT use this in production :)
      //Try and figure out how why this is unsafe and how to fix it.
      //HINT: the answer is in the XKCD comic on the home page little bobby tables :)
      db.exec(`insert into blog(blog_txt, blog_title)
                values ('${req.body.blog}', '${req.body.blog_title}');`)
      //redirect to homepage
      res.redirect('/');
    }
  );
});

router.post('/delete', (req, res, next) => {
  console.log("Deleting blog with this id");
  var db = new sqlite3.Database('myBlog.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      console.log("deleting " + req.body.blog);
      db.exec(`delete from blog where blog_id='${req.body.blog}';`);     
      res.redirect('/');
    }
  );
});

router.post('/edit', (req, res, next) => {
  console.log("Editing blog with this id");
  var db = new sqlite3.Database('myBlog.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      console.log("editing 2" + req.body.blog)
      db.exec(`update blog set blog_title='${req.body.blog_title}' where blog_id='${req.body.blog}';`);
      res.redirect('/');
    }
  );
});

router.post('/clear', (req, res, next) => {
  console.log("Editing blog with this id");
  var db = new sqlite3.Database('myBlog.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      db.exec(`DROP TABLE blog;`);
      res.redirect('/');
    }
  );
});


module.exports = router;
