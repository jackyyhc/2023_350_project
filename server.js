const express = require("express");
const mysql = require("mysql2");
const ejs = require("ejs");
const session = require('cookie-session');
const bodyParser = require('body-parser');
const app = express();

const { response } = require("express");

// Set up the view engine
app.set("view engine", "ejs");

// Set up the static directory
app.use(express.static(__dirname + '/public'));

const connection = mysql.createConnection({
  host: "139.162.49.133",
  user: "admin",
  password: "Jeffisthebest.01",
  database: "350_group_project_1",
  port: "3306",
  multipleStatements: true,
});

// Connect to the database
connection.connect();

// for parsing application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const SECRETKEY = 'let me pass';
app.use(session({
  name: 'user-session',
  keys: [SECRETKEY]
}));

app.get("/", (req, res) => {
  console.log(req.session);
  if (!req.session.authenticated) {
    res.render('login.ejs');
  } else if (req.session.role == 'teacher' || req.session.role == 'student') {
    res.redirect('/home');
  }
  else {
    res.redirect('/');
  }
});

app.post("/password_modification", (req, res) => {
  if (!req.session.authenticated) {
    res.redirect('/');
  } else if (req.session.role == 'teacher' || req.session.role == 'student') {
    let sql = 'select password from 350_group_project_1.user where username = ?;';
    connection.query(sql, [req.body.student_id], (error, results, fields) => {
      if (error) throw error;
      const orginal_pw = results[0].password;
      const username = req.body.student_id;
      const password = req.body.new_password;
      if (req.body.password != orginal_pw) {
        res.render('password_issue.ejs', {message: "Password Incorrect"});
      }
      else if (req.body.new_password != req.body.confirm_password) {
        res.render('password_issue.ejs', {message: "Password Not Match"});
      }
      else if (req.body.new_password == "" || password.length < 8) {
        res.render('password_issue.ejs', {message: "Password Not Satisfied Rule"});
      }
      else {
        let sql = 'SET SQL_SAFE_UPDATES=0;UPDATE 350_group_project_1.user SET password = ? WHERE username = ?;SET SQL_SAFE_UPDATES=1;';
        connection.query(sql, [password, username], (error, results, fields) => {
          if (error) throw error;
          if (results[1].affectedRows) {
            res.render('password_issue.ejs', {message: "Password Change Successful"});
          }
          else {
            res.redirect('/');
          }
        })
      }
    })
  }
}
);

app.post("/submit-student-info", (req, res) => {
  if (!req.session.authenticated) {
    res.redirect('/');
  } else if (req.session.role == 'teacher' || req.session.role == 'student') {
    let sql = 'select * from 350_group_project_1.student_personal_information where username = ?;';
    connection.query(sql, [req.body.username], (error, results, fields) => {
      // compare the data in database and the data user input
      if (results[0].first_name != req.body.first_name || results[0].last_name != req.body.last_name || results[0].phone_no != req.body.phone_no || results[0].ec_name != req.body.ec_name || results[0].ec_phone_no != req.body.ec_phone_no || results[0].ec_relation != req.body.ec_relation) {
        let sql = 'SET SQL_SAFE_UPDATES=0;UPDATE 350_group_project_1.student_personal_information SET first_name = ?, last_name = ?, phone_no = ?, ec_name = ?, ec_phone_no = ?, ec_relation = ? WHERE username = ?;SET SQL_SAFE_UPDATES=1;';
        connection.query(sql, [req.body.first_name, req.body.last_name, req.body.phone_no, req.body.ec_name, req.body.ec_phone_no, req.body.ec_relation, req.body.username], (error, results, fields) => {
          if (error) throw error;
          if (results[1].affectedRows) {
            res.render('student_role_student_info.ejs',
              {
                username: req.session.username,
                role: req.session.role,
                results: req.body,
                message: "Update successfully!"
              });
          }
          else {
            res.redirect('/');
          }
        })
      }
      else {
        res.redirect('/personal_information');
      }
    })
  }
}
);

app.post("/search", (req, res) => {
  if (req.session.authenticated) {
    const username = req.session.username;
    if (req.session.role == 'student') {
      let sql = 'SELECT * FROM 350_group_project_1.academic_records where student_id = ? and program_id like ? ORDER BY term asc, program_id asc';
      connection.query(sql, [username, "%" + req.body.search + "%"], (error, results, fields) => {
        if (error) throw error;
        else {
          res.render('student_home.ejs',
            {
              username: req.session.username,
              role: req.session.role,
              results: results
            });
        }
      })
    }
    if (req.session.role == 'teacher') {
      let sql = 'SELECT * FROM 350_group_project_1.academic_records where program_id like ? ORDER BY term asc, program_id asc';
      connection.query(sql, ["%" + req.body.search + "%"], (error, results, fields) => {
        if (error) throw error;
        else {
          res.render('teacher_home.ejs',
            {
              username: req.session.username,
              role: req.session.role,
              results: results,
            });
        }
      })
    }
  }
});


app.post('/login', (req, res) => {
  console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;
  let sql = 'SELECT * FROM 350_group_project_1.user where username = ? and password = ?';
  connection.query(sql, [username, password], (error, results, fields) => {
    if (error) throw error;
    if (results.length > 0) {
      // set session and role
      req.session.role = results[0].user_role;
      req.session.authenticated = true;
      req.session.username = username;
      res.redirect('/home');
    } else {
      res.redirect('/');
    }
  });
});

app.get('/home', (req, res) => {
  if (!req.session.authenticated) {
    res.redirect('/');
  }
  else if (req.session.authenticated) {
    const username = req.session.username;
    if (req.session.role == 'student') {
      let sql = 'SELECT * FROM 350_group_project_1.academic_records where student_id = ? ORDER BY term asc, program_id asc';
      connection.query(sql, [username], (error, results, fields) => {
        if (error) throw error;
        else {
          res.render('student_home.ejs',
            {
              username: req.session.username,
              role: req.session.role,
              results: results
            });
        }
      })
    }
    else if (req.session.role == 'teacher') {
      let sql = 'SELECT * FROM 350_group_project_1.academic_records ORDER BY student_id asc, program_id asc';
      connection.query(sql, [username], (error, results, fields) => {
        if (error) throw error;
        else {
          res.render('teacher_home.ejs',
            {
              username: req.session.username,
              role: req.session.role,
              results: results,
            });
        }
      })
    }
  }
});

app.get('/personal_information', (req, res) => {
  if (!req.session.authenticated) {
    res.redirect('/');
  }
  else if (req.session.authenticated) {
    const username = req.session.username;
    if (req.session.role == 'student') {
      let sql = 'SELECT * FROM 350_group_project_1.student_personal_information where username = ?;';
      connection.query(sql, [username], (error, results, fields) => {
        if (error) throw error;
        else {
          // console.log(results);
          res.render('student_role_student_info.ejs',
            {
              username: req.session.username,
              role: req.session.role,
              results: results[0]
            });
        }
      })
    }
    else if (req.session.role == 'teacher') {
      let sql = 'SELECT * FROM 350_group_project_1.academic_records ORDER BY student_id asc, program_id asc';
      connection.query(sql, [username], (error, results, fields) => {
        if (error) throw error;
        else {
          res.render('teacher_home.ejs',
            {
              username: req.session.username,
              role: req.session.role,
              results: results,
            });
        }
      })
    }
  }
});

app.get('/password', (req, res) => {
  if (!req.session.authenticated) {
    res.redirect('/');
  }
  else if (req.session.authenticated) {
    res.render('password_modification.ejs',
      {
        username: req.session.username,
        role: req.session.role,
      });
  }
})

// Route to fetch data from the database
app.get("/api/user", (req, res) => {
  // Perform a database query
  var search_string = ""
  if (req.query["username"] && req.query["password"]) {
    search_string = " where `username` = " + req.query["username"] + " and `password` = " + req.query["password"]
  }
  connection.query("SELECT * FROM user" + search_string, (error, results, fields) => {
    if (error) throw error;
    // Send the query results to the web page
    res.send(results);
  });
});

// Route to fetch data from the database
app.get("/api/academic_record", (req, res) => {
  var search_string = ""
  // req.query["student_id"]
  if (req.query["student_id"]) {
    search_string = " where `student_id` = " + req.query["student_id"]
  }
  // Perform a database query
  connection.query(
    "SELECT * FROM academic_records" + search_string,
    (error, results, fields) => {
      if (error) throw error;
      // Send the query results to the web page
      res.send(results);
    }
  );
});

// Close the database connection when the server is closed
app.on("close", () => {
  connection.end();
});

//logout and clear the session 
app.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
});

// Start the server on port 3000
app.listen(80, () => {
  console.log("Server started on port 3000");
});
