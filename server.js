const express = require("express");
const mysql = require("mysql2");
const ejs = require("ejs");
const session = require("cookie-session");
const bodyParser = require("body-parser");
const app = express();

const { response } = require("express");

// Set up the view engine
app.set("view engine", "ejs");

// Set up the static directory
app.use(express.static(__dirname + "/public"));

const connection = mysql.createConnection({
  host: "139.162.49.133",
  user: "350_group_project_user",
  password: "jeffisthebest",
  database: "350_group_project",
  port: "3306",
  multipleStatements: true,
});

// Connect to the database
connection.connect();

// for parsing application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const SECRETKEY = "let me pass";
app.use(
  session({
    name: "user-session",
    keys: [SECRETKEY],
  })
);

app.get("/", (req, res) => {
  if (!req.session.authenticated) {
    res.render("login.ejs");
  } else if (
    req.session.role == "teacher" ||
    req.session.role == "student" ||
    req.session.role == "admin"
  ) {
    res.redirect("/home");
  } else {
    res.redirect("/");
  }
});

app.post("/password_modification", (req, res) => {
  if (!req.session.authenticated) {
    res.redirect("/");
  } else if (
    req.session.role == "teacher" ||
    req.session.role == "student" ||
    req.session.role == "admin"
  ) {
    let sql = "select password from 350_group_project.User where userId = ?;";
    connection.query(sql, [req.body.student_id], (error, results, fields) => {
      if (error) throw error;
      const orginal_pw = results[0].password;
      const username = req.body.student_id;
      const password = req.body.new_password;
      if (req.body.password != orginal_pw) {
        res.render("password_issue.ejs", { message: "Password Incorrect" });
      } else if (req.body.new_password != req.body.confirm_password) {
        res.render("password_issue.ejs", { message: "Password Not Match" });
      } else if (req.body.new_password == "" || password.length < 8) {
        res.render("password_issue.ejs", { message: "Password Not Satisfied Rule",});
      } else if (req.body.new_password == orginal_pw) {
        res.render("password_issue.ejs", { message: "Password Not Satisfied Rule",});
      }

       else {
        let sql =
          "SET SQL_SAFE_UPDATES=0;UPDATE 350_group_project.User SET password = ? WHERE userId = ?;SET SQL_SAFE_UPDATES=1;";
        connection.query(
          sql,
          [password, username],
          (error, results, fields) => {
            if (error) throw error;
            if (results[1].affectedRows) {
              res.render("password_issue.ejs", {
                message: "Password Change Successful",
              });
            } else {
              res.redirect("/");
            }
          }
        );
      }
    });
  }
});

// need edit again
app.post("/submit-student-info", (req, res) => {
  if (!req.session.authenticated) {
    res.redirect("/");
  } else if (req.session.role == "teacher" || req.session.role == "student") {
    let sql = "select * from 350_group_project.StudentInfo where username = ?;";
    connection.query(sql, [req.body.username], (error, results, fields) => {
      // compare the data in database and the data user input
      if (
        results[0].first_name != req.body.first_name ||
        results[0].last_name != req.body.last_name ||
        results[0].phone_no != req.body.phone_no ||
        results[0].ec_name != req.body.ec_name ||
        results[0].ec_phone_no != req.body.ec_phone_no ||
        results[0].ec_relation != req.body.ec_relation
      ) {
        let sql =
          "SET SQL_SAFE_UPDATES=0;UPDATE 350_group_project.StudentInfo SET phone_no = ?, ec_name = ?, ec_phone_no = ?, ec_relation = ? WHERE username = ?;SET SQL_SAFE_UPDATES=1;";
        connection.query(
          sql,
          [
            req.body.phone_no,
            req.body.ec_name,
            req.body.ec_phone_no,
            req.body.ec_relation,
            req.body.username,
          ],
          (error, results, fields) => {
            if (error) throw error;
            if (results[1].affectedRows) {
              res.render("student_role_student_info.ejs", {
                username: req.session.username,
                role: req.session.role,
                results: req.body,
                message: "Update successfully!",
              });
            } else {
              res.redirect("/");
            }
          }
        );
      } else {
        res.redirect("/personal_information");
      }
    });
  }
});

app.post("/search", (req, res) => {
  if (req.session.authenticated) {
    const username = req.session.username;
    if (req.session.role == "student") {
      let sql =
        "SELECT * FROM 350_group_project_1.academic_records where student_id = ? and program_id like ? ORDER BY term asc, program_id asc";
      connection.query(
        sql,
        [username, "%" + req.body.search + "%"],
        (error, results, fields) => {
          if (error) throw error;
          else {
            res.render("student_home.ejs", {
              username: req.session.username,
              role: req.session.role,
              results: results,
            });
          }
        }
      );
    }
    if (req.session.role == "teacher") {
      let sql =
        "SELECT * FROM 350_group_project_1.academic_records where program_id like ? ORDER BY term asc, program_id asc";
      connection.query(
        sql,
        ["%" + req.body.search + "%"],
        (error, results, fields) => {
          if (error) throw error;
          else {
            res.render("teacher_home.ejs", {
              username: req.session.username,
              role: req.session.role,
              results: results,
            });
          }
        }
      );
    }
    if (req.session.role == "admin") {
      let sql = "SELECT * FROM 350_group_project.User where userId = ?";
      connection.query(
        sql,
        [username, "%" + req.body.search + "%"],
        (error, results, fields) => {
          if (error) throw error;
          else {
            res.render("admin_home.ejs", {
              username: req.session.username,
              role: req.session.role,
              results: results,
            });
          }
        }
      );
    }
  }
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  let sql =
    "SELECT * FROM 350_group_project.User WHERE userId = ? AND password = ?;";
  connection.query(sql, [username, password], (error, results, fields) => {
    if (error) throw error;
    if (results.length > 0) {
      // set session and role
      req.session.role = results[0].role;
      req.session.authenticated = true;
      req.session.username = results[0].userId;
      res.redirect("/home");
    } else {
      res.redirect("/");
    }
  });
});

app.get("/academic_record", (req, res) => {
  if (!req.session.authenticated) {
    res.redirect("/");
  } else if (req.session.authenticated) {
    const username = req.session.username;
    if (req.session.role == "student") {
      let sql =
        'SELECT studytable.courseCode, course.courseName, CONCAT(studytable.studyYear," ", studytable.term) as merge_term, studytable.credit, studytable.grade FROM 350_group_project.Study AS studytable LEFT JOIN 350_group_project.Course AS course ON studytable.courseCode = course.courseCode WHERE userId = ? ORDER BY studytable.studyYear ASC, studytable.courseCode ASC; select CONCAT(studyYear," ", term) as merge_term from 350_group_project.Study where userId = ? group by merge_term;';
      sql +=
        "SELECT CONCAT(studytable.studyYear, ' ', studytable.term) AS merge_term, AVG(Gpa.gpa) AS average_gpa FROM 350_group_project.Study AS studytable LEFT JOIN 350_group_project.Gpa AS Gpa ON studytable.grade = Gpa.grade WHERE studytable.userId = ? GROUP BY merge_term;";
      sql +=
        "SELECT AVG(Gpa.gpa) AS average_gpa FROM 350_group_project.Study AS studytable LEFT JOIN 350_group_project.Gpa AS Gpa ON studytable.grade = Gpa.grade WHERE studytable.userId = ? GROUP BY studytable.userId;";
      connection.query(
        sql,
        [username, username, username, username],
        (error, results, fields) => {
          if (error) throw error;
          else {
            res.render("stu_academic_record.ejs", {
              username: req.session.username,
              role: req.session.role,
              results: results[0],
              merge_term: results[1],
              gpa: results[2],
              cgpa: results[3][0],
            });
          }
        }
      );
    }
  }
});

app.get("/home", (req, res) => {
  if (!req.session.authenticated) {
    res.redirect("/");
  } else if (req.session.authenticated) {
    const username = req.session.username;
    if (req.session.role == "student") {
      let sql =
        "SELECT usertable.userid, usertable.userfName, usertable.userlName, usertable.role,        350_group_project.StudentInfo.programme, 350_group_project.StudentInfo.admYear,        350_group_project.StudentInfo.admTerm, status_information.status_desc,        350_group_project.StudentInfo.standing FROM 350_group_project.User AS usertable INNER JOIN 350_group_project.StudentInfo ON usertable.userid = 350_group_project.StudentInfo.userId INNER JOIN 350_group_project.status_information ON 350_group_project.StudentInfo.status = status_information.status WHERE usertable.userId = ?;";
      connection.query(sql, [username], (error, results, fields) => {
        if (error) throw error;
        else {
          res.render("student_home.ejs", {
            username: req.session.username,
            role: req.session.role,
            results: results[0],
          });
        }
      });
    } else if (req.session.role == "teacher") {
      let sql =
        "SELECT userId, userfName, userlName FROM 350_group_project.User WHERE userId = ? ";
      connection.query(sql, [username], (error, results, fields) => {
        if (error) throw error;
        else {
          res.render("teacher_home.ejs", {
            username: req.session.username,
            role: req.session.role,
            results: results[0],
          });
        }
      });
    } else if (req.session.role == "admin") {
      let sql =
        "SELECT userid, userfName, userlName, role FROM 350_group_project.User WHERE userId = ?;";
      connection.query(sql, [username], (error, results, fields) => {
        if (error) throw error;
        else {
          res.render("admin_home.ejs", {
            username: req.session.username,
            role: req.session.role,
            results: results[0],
          });
        }
      });
    }
  }
});
// student
app.post("/personal_info", (req, res) => {
  if (!req.session.authenticated) {
    res.redirect("/");
  } else if (req.session.authenticated) {
    const username = req.body.username;
    let sql =
      "SET SQL_SAFE_UPDATES=0;UPDATE 350_group_project.StudentInfo SET phoneNo = ? WHERE userId = ?;SET SQL_SAFE_UPDATES=1;";
    connection.query(
      sql,
      [req.body.phoneNo, req.body.username],
      (error, results, fields) => {
        if (error) throw error;
        if (results[1].affectedRows) {
          res.render("student_role_student_info.ejs", {
            username: req.session.username,
            role: req.session.role,
            results: req.body,
            message: "Update successfully!",
          });
        }
      }
    );
  }
});

app.get("/personal_information", (req, res) => {
  if (!req.session.authenticated) {
    res.redirect("/");
  } else if (req.session.authenticated) {
    const username = req.session.username;
    if (req.session.role == "student") {
      let sql =
        "SELECT * FROM stu_personal_record where userId = ?;";
      connection.query(sql, [username], (error, results, fields) => {
        if (error) throw error;
        else {
          res.render("stu_personal_info.ejs", {
            username: req.session.username,
            role: req.session.role,
            results: results[0],
          });
        }
      });
    } else if (req.session.role == "teacher") {
      let sql =
        "SELECT * FROM 350_group_project_1.academic_records ORDER BY student_id asc, program_id asc";
      connection.query(sql, [username], (error, results, fields) => {
        if (error) throw error;
        else {
          res.render("teacher_home.ejs", {
            username: req.session.username,
            role: req.session.role,
            results: result,
          });
        }
      });
    }
  }
});

app.get("/emergency_contact", (req, res) => {
  if (!req.session.authenticated) {
    res.redirect("/");
  } else if (req.session.role == "student") {
    const username = req.session.username;
    let sql = "SELECT * FROM 350_group_project.EmgContact WHERE userId = ?;";
    connection.query(sql, [username], (error, results, fields) => {
      if (error) throw error;
      else {
        res.render("stu_emg_contact.ejs", {
          username: req.session.username,
          role: req.session.role,
          results: results[0],
        });
      }
    });
  }
});

app.post("/emergency_contact", (req, res) => {
  if (!req.session.authenticated) {
    res.redirect("/");
  } else if (req.session.role == "student") {
    const username = req.body.username;
    var columnName = Object.keys(req.body)[0];
    var sql = `SET SQL_SAFE_UPDATES=0;UPDATE 350_group_project.EmgContact SET ${columnName} = ? WHERE userId = ?;SET SQL_SAFE_UPDATES=1;`;
    connection.query(
      sql,
      [req.body[Object.keys(req.body)[0]], req.body.username],
      (error, results, fields) => {
        if (error) throw error;
        if (results[1].affectedRows) {
          res.render("stu_emg_contact.ejs", {
            username: req.session.username,
            role: req.session.role,
            results: req.body,
            message: "Update successfully!",
          });
        }
      }
    );
  }
});

//teacher
app.get("/assessment", (req, res) => {
  if (!req.session.authenticated) {
    res.redirect("/");
  } else if (req.session.authenticated) {
    const username = req.session.username;
    if (req.session.role == "teacher") {
      let sql = "SELECT * FROM assessment WHERE teacherId = ? ";
      connection.query(sql, [username], (error, results, fields) => {
        if (error) throw error;
        else {
          res.render("teacher_assessment", {
            username: req.session.username,
            role: req.session.role,
            results: results,
          });
        }
      });
    }
  }
});

app.get("/class_assessment", (req, res) => {
  if (!req.session.authenticated) {
    res.redirect("/");
  } else if (req.session.authenticated) {
    const username = req.session.username;
    if (req.session.role == "teacher") {
      let sql = "SELECT * FROM class_assessment";
      connection.query(sql, [username], (error, results, fields) => {
        if (error) throw error;
        else {
          res.render("teacher_class_assessment", {
            username: req.session.username,
            role: req.session.role,
            results: results,
          });
        }
      });
    }
  }
});
// to be continue
// app.post("/change_academic_record", (req, res) => {
//   if (!req.session.authenticated) {
//     res.redirect("/");
//   } else if (req.session.role == "teacher") {
//     const username = req.body.username;
//     var columnName = Object.keys(req.body)[0];
//     var sql = `SET SQL_SAFE_UPDATES=0;UPDATE 350_group_project.academic_records SET ${columnName} = ? WHERE student_id = ? and program_id = ?;SET SQL_SAFE_UPDATES=1;`;
//     connection.query(
//       sql,
//       [
//         req.body[Object.keys(req.body)[0]],
//         req.body.student_id,
//         req.body.program_id,
//       ],
//       (error, results, fields) => {
//         if (error) throw error;
//         if (results[1].affectedRows) {
//           res.render("teacher_class_assessment", {
//             username: req.session.username,
//             role: req.session.role,
//             results: req.body,
//             message: "Update successfully!",
//           });
//         }
//       }
//     );
//   }
// }
// );

app.get("/course", (req, res) => {
  if (!req.session.authenticated) {
    res.redirect("/");
  } else if (req.session.authenticated) {
    const username = req.session.username;
    if (req.session.role == "teacher") {
      let sql =
        "SELECT teacherId, teachYear, term, userfName, userlName, Teach.courseCode, Course.courseName FROM 350_group_project.Teach AS Teach LEFT JOIN 350_group_project.Course AS Course ON Teach.courseCode = Course.courseCode LEFT JOIN 350_group_project.User AS User ON teacherId = userId WHERE teacherId=?;";
      connection.query(sql, [username], (error, results, fields) => {
        if (error) throw error;
        else {
          res.render("teacher_course", {
            username: req.session.username,
            role: req.session.role,
            results: results,
          });
        }
      });
    }
  }
});

app.get("/course_stu_list", (req, res) => {
  // get parameter fromurl
  const courseCode = req.query.courseCode;
  const teachYear = req.query.teachYear;
  const term = req.query.term;
  if (!req.session.authenticated) {
    res.redirect("/");
  }
  if (req.session.authenticated) {
    const username = req.session.username;
    if (req.session.role == "teacher") {
      let sql =
        "SELECT * FROM class_assessment WHERE courseCode = ? AND teachYear = ? AND term = ?;";
      connection.query(
        sql,
        [courseCode, teachYear, term],
        (error, results, fields) => {
          if (error) throw error;
          else {
            res.send(results);
            // res.render("teacher_course_stu_list", {
            //   username: req.session.username,
            //   role: req.session.role,
            //   results: results,
            // });
          }
        }
      );
    }
  }
});

app.get("/teacher_stu_info", (req, res) => {
  if (!req.session.authenticated) {
    res.redirect("/");
  } else if (req.session.authenticated) {
    const username = req.session.username;
    if (req.session.role == "teacher") {
      let sql =
        "SELECT teachId, courseCode, courseName, teachYear, term, studId, studlName, studfName, grade FROM 350_group_project.ClassView;";
      connection.query(sql, [username], (error, results, fields) => {
        if (error) throw error;
        else {
          res.render("teacher_stu_info", {
            username: req.session.username,
            role: req.session.role,
            results: results,
          });
        }
      });
    }
  }
});

app.post("/search_stu_info", (req, res) => {
  if (!req.session.authenticated) {
    res.redirect("/");
  } else if (req.session.authenticated) {
    const username = req.session.username;
    const searchMethod = req.body.submitBtn;
    if (req.session.role == "teacher") {
      if (searchMethod == "idSearch") {
        const criteria = "%" + req.body.searchId + "%";
        const theCriteria = req.body.searchId;
        let sql =
          "SELECT User.userId, userfName, userlName, sex, phoneNo, address, admYear, admTerm, status_desc, standing, programme FROM 350_group_project.User AS User LEFT JOIN 350_group_project.StudentInfo AS Stud ON User.userId = Stud.userId LEFT JOIN 350_group_project.status_information AS Status_info ON Stud.status = Status_info.status WHERE User.userId LIKE ?;";
        connection.query(sql, [criteria], (error, results, fields) => {
          if (error) throw error;
          else {
            res.render("teacher_stu_info_result", {
              username: req.session.username,
              role: req.session.role,
              theCriteria: theCriteria,
              results: results,
            });
          }
        });
      } else if (searchMethod == "nameSearch") {
        const criteria = "%" + req.body.searchName + "%";
        const theCriteria = req.body.searchName;
        let sql =
          "SELECT User.userId, userfName, userlName, sex, phoneNo, address, admYear, admTerm, status_desc, standing, programme FROM 350_group_project.User AS User LEFT JOIN 350_group_project.StudentInfo AS Stud ON User.userId = Stud.userId LEFT JOIN 350_group_project.status_information AS Status_info ON Stud.status = Status_info.status WHERE UserfName LIKE ? OR UserlName Like ?;";
        connection.query(
          sql,
          [criteria, criteria],
          (error, results, fields) => {
            if (error) throw error;
            else {
              res.render("teacher_stu_info_result", {
                username: req.session.username,
                role: req.session.role,
                theCriteria: theCriteria,
                results: results,
              });
            }
          }
        );
      }
    }
  }
});

app.get("/teacher_stu_info_result", (req, res) => {
  if (!req.session.authenticated) {
    res.redirect("/");
  } else if (req.session.authenticated) {
    const username = req.session.username;
    if (req.session.role == "teacher") {
      let sql =
        "SELECT User.userId, userfName, userlName, sex, phoneNo, address, admYear, admTerm, status_desc, standing, programme FROM 350_group_project.User AS User LEFT JOIN 350_group_project.StudentInfo AS Stud ON User.userId = Stud.userId;";
      connection.query(sql, [username], (error, results, fields) => {
        if (error) throw error;
        else {
          res.render("teacher_stu_info_result", {
            username: req.session.username,
            role: req.session.role,
            results: results,
          });
        }
      });
    }
  }
});

app.get("/teacher_stu_emgContact", (req, res) => {
  if (!req.session.authenticated) {
    res.redirect("/");
  } else if (req.session.authenticated) {
    const username = req.session.username;
    if (req.session.role == "teacher") {
      let sql =
        "SELECT teachId, courseCode, courseName, teachYear, term, studId, studlName, studfName, grade FROM 350_group_project.ClassView;";
      connection.query(sql, [username], (error, results, fields) => {
        if (error) throw error;
        else {
          res.render("teacher_stu_emgContact", {
            username: req.session.username,
            role: req.session.role,
            results: results,
          });
        }
      });
    }
  }
});

app.post("/search_stu_emg", (req, res) => {
  if (!req.session.authenticated) {
    res.redirect("/");
  } else if (req.session.authenticated) {
    const username = req.session.username;
    const searchMethod = req.body.submitBtn;
    if (req.session.role == "teacher") {
      if (searchMethod == "idSearch") {
        const criteria = "%" + req.body.searchId + "%";
        const theCriteria = req.body.searchId;
        let sql =
          "SELECT User.userId, userfName, userlName, emgPerson, emgPhoneNo,relationship FROM 350_group_project.User AS User LEFT JOIN 350_group_project.StudentInfo AS Stud ON User.userId = Stud.userId LEFT JOIN 350_group_project.EmgContact AS Emg ON User.userId = Emg.userId WHERE User.userId LIKE ?;";
        connection.query(sql, [criteria], (error, results, fields) => {
          if (error) throw error;
          else {
            res.render("teacher_stu_emg_result", {
              username: req.session.username,
              role: req.session.role,
              theCriteria: theCriteria,
              results: results,
            });
          }
        });
      } else if (searchMethod == "nameSearch") {
        const criteria = "%" + req.body.searchName + "%";
        const theCriteria = req.body.searchName;
        let sql =
          "SELECT User.userId, userfName, userlName, emgPerson, emgPhoneNo,relationship FROM 350_group_project.User AS User LEFT JOIN 350_group_project.StudentInfo AS Stud ON User.userId = Stud.userId LEFT JOIN 350_group_project.EmgContact AS Emg ON User.userId = Emg.userId WHERE UserfName LIKE ? OR UserlName Like ?;";
        connection.query(
          sql,
          [criteria, criteria],
          (error, results, fields) => {
            if (error) throw error;
            else {
              res.render("teacher_stu_emg_result", {
                username: req.session.username,
                role: req.session.role,
                theCriteria: theCriteria,
                results: results,
              });
            }
          }
        );
      }
    }
  }
});

app.get("/teacher_stu_emg_result", (req, res) => {
  if (!req.session.authenticated) {
    res.redirect("/");
  } else if (req.session.authenticated) {
    const username = req.session.username;
    if (req.session.role == "teacher") {
      let sql =
        "SELECT User.userId, userfName, userlName, emgPerson, emgPhoneNo,relationship FROM 350_group_project.User AS User LEFT JOIN 350_group_project.StudentInfo AS Stud ON User.userId = Stud.userId LEFT JOIN 350_group_project.EmgContact AS Emg ON User.userId = Emg.userId;";
      connection.query(sql, [username], (error, results, fields) => {
        if (error) throw error;
        else {
          res.render("teacher_stu_emg_result", {
            username: req.session.username,
            role: req.session.role,
            results: results,
          });
        }
      });
    }
  }
});

app.get("/teacher_stu_academic", (req, res) => {
  if (!req.session.authenticated) {
    res.redirect("/");
  } else if (req.session.authenticated) {
    const username = req.session.username;
    if (req.session.role == "teacher") {
      let sql =
        "SELECT teachId, courseCode, courseName, teachYear, term, studId, studlName, studfName, grade FROM 350_group_project.ClassView;";
      connection.query(sql, [username], (error, results, fields) => {
        if (error) throw error;
        else {
          res.render("teacher_stu_academic", {
            username: req.session.username,
            role: req.session.role,
            results: results,
          });
        }
      });
    }
  }
});

app.post("/search_stu_academic", (req, res) => {
  if (!req.session.authenticated) {
    res.redirect("/");
  } else if (req.session.authenticated) {
    const username = req.session.username;
    const searchMethod = req.body.submitBtn;
    if (req.session.role == "teacher") {
      if (searchMethod == "idSearch") {
        const criteria = "%" + req.body.searchId + "%";
        const theCriteria = req.body.searchId;
        let sql =
          "SELECT User.userId, userfName, userlName, sex, admYear, admTerm, status_desc, standing, programme FROM 350_group_project.User AS User LEFT JOIN 350_group_project.StudentInfo AS Stud ON User.userId = Stud.userId LEFT JOIN 350_group_project.status_information AS Status_info ON Stud.status = Status_info.status WHERE User.userId LIKE ?;";
        connection.query(sql, [criteria], (error, results, fields) => {
          if (error) throw error;
          else {
            res.render("teacher_stu_academic_result", {
              username: req.session.username,
              role: req.session.role,
              theCriteria: theCriteria,
              results: results,
            });
          }
        });
      } else if (searchMethod == "nameSearch") {
        const criteria = "%" + req.body.searchName + "%";
        const theCriteria = req.body.searchName;
        let sql =
          "SELECT User.userId, userfName, userlName, sex, admYear, admTerm, status_desc, standing, programme FROM 350_group_project.User AS User LEFT JOIN 350_group_project.StudentInfo AS Stud ON User.userId = Stud.userId LEFT JOIN 350_group_project.status_information AS Status_info ON Stud.status = Status_info.status WHERE UserfName LIKE ? OR UserlName Like ?;";
        connection.query(
          sql,
          [criteria, criteria],
          (error, results, fields) => {
            if (error) throw error;
            else {
              res.render("teacher_stu_academic_result", {
                username: req.session.username,
                role: req.session.role,
                theCriteria: theCriteria,
                results: results,
              });
            }
          }
        );
      }
    }
  }
});

app.get("/teacher_stu_academic_result", (req, res) => {
  if (!req.session.authenticated) {
    res.redirect("/");
  } else if (req.session.authenticated) {
    const username = req.session.username;
    if (req.session.role == "teacher") {
      let sql =
        "SELECT User.userId, userfName, userlName, sex, admYear, admTerm, status_desc, standing, programme FROM 350_group_project.User AS User LEFT JOIN 350_group_project.StudentInfo AS Stud ON User.userId = Stud.userId LEFT JOIN 350_group_project.status_information AS Status_info ON Stud.status = Status_info.status;";
      connection.query(sql, [username], (error, results, fields) => {
        if (error) throw error;
        else {
          res.render("teacher_stu_academic_result", {
            username: req.session.username,
            role: req.session.role,
            results: results,
          });
        }
      });
    }
  }
});
// admin
app.get("/manage_course", (req, res) => {
  if (!req.session.authenticated) {
    res.redirect("/");
  } else if (req.session.authenticated) {
    const username = req.session.username;
    if (req.session.role == "admin") {
      let sql =
        "SELECT teacherId, teachYear, term, userfName, userlName, Teach.courseCode, Course.courseName FROM 350_group_project.Teach AS Teach LEFT JOIN 350_group_project.Course AS Course ON Teach.courseCode = Course.courseCode LEFT JOIN 350_group_project.User AS User ON teacherId = userId;";
      connection.query(sql, [username], (error, results, fields) => {
        if (error) throw error;
        else {
          res.render("admin_manage_course", {
            username: req.session.username,
            role: req.session.role,
            results: results,
          });
        }
      });
    }
  }
});

//#################################

app.get("/password", (req, res) => {
  if (!req.session.authenticated) {
    res.redirect("/");
  } else if (req.session.authenticated) {
    res.render("password_modification.ejs", {
      username: req.session.username,
      role: req.session.role,
    });
  }
});

// Route to fetch data from the database
app.get("/api/user", (req, res) => {
  // Perform a database query
  var search_string = "";
  if (req.query["username"] && req.query["password"]) {
    search_string =
      " where `userId` = " +
      req.query["username"] +
      " and `password` = " +
      req.query["password"];
  }
  connection.query(
    "SELECT * FROM User" + search_string,
    (error, results, fields) => {
      if (error) throw error;
      // Send the query results to the web page
      res.send(results);
    }
  );
});

// Route to fetch data from the database
app.get("/api/academic_record", (req, res) => {
  var search_string = "";
  // req.query["student_id"]
  if (req.query["student_id"]) {
    search_string = " where `student_id` = " + req.query["student_id"];
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
app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

// Start the server on port 3000
app.listen(80, () => {
  console.log("Server started on port 80");
});
