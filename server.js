var express = require('express');
var mysql = require("mysql");
var app = express();
var https = require('http');
var fs = require('fs');
var crypto = require('crypto');
var path = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');
var port = 8005;
var nodemailer = require("nodemailer");

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser());


var smtpTransport = nodemailer.createTransport("SMTP", {
  host: 'mail.cesltd.com',
  port: '25',
  auth: {
    user: "sandeep.sidhardhan@cesltd.com",
    pass: "s147S963#"
  }
});


var db_config = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cab',
  multipleStatements: true
};

var con;

// function handleDisconnect() {
//
//   con = mysql.createConnection(db_config);
//   con.connect(function(err) {
//     if (err) {
//       console.log('Error connecting to Db : ', err);
//       setTimeout(handleDisconnect, 2000);
//     }
//     console.log('connected to database');
//   });
//   con.on('error', function(err) {
//     console.log('db error', err);
//     if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//       handleDisconnect();
//     } else {
//       throw err;
//     }
//   });
// }
//
// handleDisconnect();

// EMail Id check
app.get('/login', function(req, res) {
  var resData = {
      "success": false,
      "data": null
    }
    //var hashPass = crypto.createHash('md5').update(req.headers.pass).digest("hex");
  con.query('SELECT password from employee where emp_email = ?', [req.headers.email], function(err, row, field) {
    console.log(req.headers.email);
    console.log(row);
    if (!err) {
      if (row.length > 0) {
        if (req.headers.pass == row[0].password) {
          resData.success = true;
          resData.data = row;
          res.send(resData);
        } else {
          res.send(resData);
        }
      } else {
        res.send(resData);
      }
    } else {
      res.send(resData);
    }
  });

});

app.get('/search', function(req, res) {
  var resData = {
    "success": false,
    "result": null
  }
  con.query('select * from employee where emp_email = ?', [req.headers.email], function(err, rows, fields) {
    console.log("uname" + req.headers.uname);
    if (!err) {
      resData.success = true;
      resData.result = rows;
      res.send(resData);

    } else {
      //con.end();
      res.send("Problem");
    }
  });
});

// Email Id check
app.get('/routeDetails', function(req, res) {
  var resData = {
    "success": false,
    "data": null
  }

  console.log("routeDetails");
  console.log(req.headers.email);
  con.query('select emp_name , pick_up from employee where route_no = (select route_no from employee where emp_email = ?)', [req.headers.email], function(err, rows, fields) {
    if (!err) {
      if (rows.length > 0) {
        resData.success = true;
        resData.data = rows;
        res.send(resData);
      } else {
        res.send(resData);
      }
    } else {
      //con.end();
      res.send("Problem");
    }

  });
});

app.get('/getAllDetails', function(req, res) {
  var cabDetails = {
    "success": false,
    "data": null
  }
  var uname = req.headers.uname;
  var d = new Date();
  var curr_date = d.getDate();
  var curr_month = d.getMonth() + 1;
  var curr_year = d.getFullYear();
  var todayDate = curr_year + "-" + curr_month + "-" + curr_date;
  con.query('select a.time, a.date, b.emp_name, b.route_no, b.pick_up  from booknow a,employee b where a.emp_email = b.emp_email; select * from employee; select a.*,b.emp_name,b.pick_up,b.route_no from cancellation a,employee b where (a.cabtype = "morning") and (a.emp_email=b.emp_email) ; select a.*,b.emp_name,b.pick_up,b.route_no from cancellation a,employee b where (a.cabtype = "night") and (a.emp_email=b.emp_email); select * from employee where date = ?', [todayDate], function(err, results) {
    console.log(results);
    if (!err) {
      cabDetails.success = true;
      cabDetails.data = results;
      res.send(cabDetails);
    } else {
      //con.end();
      console.log("Error");
      res.send("Problem");
    }
  });
});


app.get('/getDetails', function(req, res) {
  var resData = {
    "success": false,
    "data": null,
    "secondData": null
  }
  var ename = req.headers.uname;
  console.log(ename);
  con.query('select * from booknow where emp_email = ?', [ename, ename], function(err, rows, fields) {

    if (!err) {
      if (rows.length <= 0) {
        resData.success = false;
        resData.data = rows;
        res.send(resData);
      } else {
        resData.success = true;
        resData.data = rows;
        res.send(resData);
      }

    } else {
      //con.end();
      res.send(resData);
    }

  });
});

// Emaild Id check
app.post('/booking', function(req, res) {
  var resData = {
    "success": false,
    "data": null
  }
  var bookingDate = req.body.date;
  var bookingTime = req.body.time;
  var uname = req.body.uname;
  console.log(bookingDate);
  con.query('select * from booknow where emp_email= ?', [req.headers.email], function(err, rows, fields) {
    if (!err) {
      if (rows.length > 0) {
        con.query('update booknow SET date = ? , time = ? where emp_email = ?', [bookingDate, bookingTime, req.headers.email], function(err, result) {
          if (!err) {
            console.log(result);
            resData.success = true;
            resData.data = null;
            res.send(resData);
          } else {
            //con.end();
            res.send(resData);
          }
        });
      } else {
        con.query('insert into booknow SET date = ? , time = ? , emp_email = ?', [bookingDate, bookingTime, req.headers.email], function(err, result) {
          if (!err) {
            console.log(result);
            resData.success = true;
            resData.data = null;
            res.send(resData);
          } else {
            //con.end();
            res.send(resData);
          }
        });
      }
    } else {
      //con.end();
      res.send(resData);
    }
  });
});

app.post('/addRouteNo', function(req, res) {
  var resData = {
    "success": false,
    "data": null
  }
  console.log(req.body.routeNo);
  var arr = ['Paridhi', 'Sumbul'];
  var stringObj = JSON.stringify(arr);
  console.log(stringObj);
  con.query('select * from routes where route_no = ?', req.body.routeNo, function(err, rows, fields) {
    if (!err) {
      if (rows.length <= 0) {
        con.query("insert into routes SET route_no = ?", req.body.routeNo, function(err, result) {
          if (!err) {
            resData.success = true;
            resData.data = null;
            res.send(resData);
          } else {
            res.send(resData);
          }
        });
      } else {
        console.log("value exist");
        res.send(resData);
      }
    } else {
      console.log("Error");
      res.send(resData);
    }


  })

});

app.post('/updateEmployee', function(req, res) {
  var resData = {
    "success": false,
    "data": null
  }
  console.log(req.body);
  con.query('update employee SET route_no = ? where emp_name = ? and pick_up = ?', [req.body.routeNum, req.body.newMember.emp_name, req.body.newMember.pick_up], function(err, result) {
    if (!err) {
      console.log("updated");
      resData.success = true;
      resData.data = null;
      res.send(resData);
    } else {
      console.log("problem");
      res.send(resData);
    }
  });
});

app.post('/cancelcab', function(req, res) {
  var resData = {
    "success": false,
    "data": null
  }
  var d = new Date();
  var curr_date = d.getDate();
  var curr_month = d.getMonth() + 1;
  var curr_year = d.getFullYear();
  var todayDate = curr_year + "-" + curr_month + "-" + curr_date;
  var uname = req.body.uname;
  var type = req.body.type;
  var date = req.body.date;
  console.log(date);
  con.query('select * from cancellation where emp_email = ? and cabtype = ? and date = ?', [uname, type, todayDate], function(err, rows, fields) {
    console.log(rows);
    if (!err) {
      if (rows.length <= 0) {
        con.query('insert into cancellation SET date = ? , emp_email = ?, cabtype = ?', [date, req.headers.email, type], function(err, result) {

          if (!err) {
            console.log("inserted...");
            resData.success = true;
            resData.data = null;
            res.send(resData);
          } else {
            console.log("problem");
            res.send(resData);
          }

        });
      } else {
        res.send(resData);
        console.log("Already exist");
      }
    } else {
      //con.end();
      res.send(resData);
    }


  });

});

// Email Id check
app.get('/checkcancelcab', function(req, res) {
  var resData = {
    "success": false,
    "data": null
  }
  var d = new Date();
  var curr_date = d.getDate();
  var curr_month = d.getMonth() + 1;
  var curr_year = d.getFullYear();
  var todayDate = curr_year + "-" + curr_month + "-" + curr_date;
  var uname = req.headers.uname;
  var cabType = req.headers.type;
  var email = req.headers.email;
  console.log(cabType);
  con.query('select * from cancellation where emp_email = ? and cabtype = ? and date = ?', [email, cabType, todayDate], function(err, rows, fields) {
    console.log(rows.length);

    if (!err) {
      if (rows.length > 0) {
        resData.success = true;
        resData.data = null;
        res.send(resData);
      } else {
        resData.success = false;
        resData.data = null;
        res.send(resData);
      }
    } else {
      res.send(resData);
    }


  });


});


//Reset Password
app.post('/resetPassword', function(req, res) {

  var password = "pass" + generateOTP();
  var resData = {
    "success": false,
    "data": null
  }
  console.log(req.body);
  var email = req.body.email;
  console.log(req.body.email);
  con.query('select * from employee where emp_email = ?', [email], function(err, rows, fields) {
    console.log(rows.length);
    if (!err) {
      if (rows.length <= 0) {
        res.send(resData);
      } else {

        var hashPass = crypto.createHash('md5').update(password).digest("hex");
        console.log(email);
        console.log(hashPass);
        con.query('update employee SET password = ? where emp_email = ?', [hashPass, email], function(err, result) {
          if (!err) {
            var mailOptions = {
              from: "sandeep.sidhardhan@cesltd.com",
              to: req.body.email,
              subject: "Password For Ces-Cab Service App",
              text: "New password for your account is : " + password
            }

            console.log(mailOptions);

            smtpTransport.sendMail(mailOptions, function(error, response) {
              if (error) {
                console.log(error);
                res.send(resData);
              } else {
                resData.success = true;
                resData.data = null;
                console.log("Message sent: " + response.message);
                resData.mail = true;
                res.send(resData);
              }

            });
          } else {
            console.log("Update Error");
            res.send(resData);
          }

        });

      }
    } else {
      console.log("Not Found data");
      res.send(resData);
    }

  });
});

//Reset Password

//Get Employee Route Details
app.get('/getAllEmployee', function(req, res) {
  var resData = {
    "success": false,
    "data": null
  }
  con.query('select emp_name, pick_up from employee', function(err, rows, fields) {
    if (!err) {
      console.log(rows);
      resData.success = true;
      resData.data = rows;
      res.send(resData);
    } else {
      res.send(resData);
    }
  });
});

app.get('/getAllRoutes', function(req, res) {
  var resData = {
    "success": false,
    "data": null
  }
  con.query('select route_no from routes', function(err, rows, fields) {
    if (!err) {
      console.log(rows);
      resData.success = true;
      resData.data = rows;
      res.send(resData);
    } else {
      res.send(resData);
    }
  });
});

app.get('/getRouteMembers', function(req, res) {
  var resData = {
    "success": false,
    "data": null
  }
  console.log("Inside getRoute Members");
  console.log(req.headers.routeno);
  con.query('select emp_name , pick_up from employee where route_no = ?', req.headers.routeno, function(err, rows, fields) {
    if (!err) {
      console.log(rows);
      resData.success = true;
      resData.data = rows;
      res.send(resData);
    } else {
      res.send(resData);
    }
  });
});




//Get Employee Route Details

// Email Id check
app.post('/saveRoute', function(req, res) {
  var resData = {
    "success": false,
    "data": null
  }
  console.log(req.body);
  var ename = req.body.name;
  var newPickup = req.body.route;
  var date = req.body.date;

  con.query('update employee SET pick_up = ? , date = ? where emp_email = ?', [newPickup, date, ename], function(err, result) {
    if (!err) {
      console.log(result);
      resData.success = true;
      resData.data = null;
      res.send(resData);
    } else {
      //con.end();
      res.send(resData);
    }
  });
});

//Not Required
app.post('/insert', function(req, res) {
  var resData = {
    "success": false,
    "data": null
  }
  console.log(req.body.model);
  var ename = req.body.model.name;
  var mob = req.body.model.mob;
  var pickup = req.body.model.pickup;
  var route = req.body.model.route;
  con.query('insert into employee SET emp_name = ? , emp_mob = ? , pick_up = ? , route_no = ?', [ename, mob, pickup, route], function(err, result) {
    if (!err) {
      resData.success = true;
      resData.data = null;
      res.send(resData);
    } else {
      console.log(err);
      //con.end();
      res.send(resData);
    }
  });
});

app.post('/update', function(req, res) {
  var resData = {
    "success": false,
    "data": null
  }
  console.log("Updating...");
  console.log(req.body.model1);
  var email = req.body.model1.email;
  var mob = req.body.model1.mob;
  var pickup = req.body.model1.pickup;
  var route = req.body.model1.route;
  console.log("email :" + email);
  console.log("mob :" + mob);
  console.log("pickup :" + pickup);
  console.log("route :" + route);

  con.query('update employee SET emp_mob = ? , pick_up = ? , route_no = ? where emp_email = ?', [mob, pickup, route, email], function(err, result) {
    if (!err) {
      console.log("Updating Employee...");
      console.log(result);
      resData.success = true;
      resData.data = null;
      res.send(resData);
    } else {
      console.log(err);
      //con.end();
      res.send(resData);
    }
  });
});

app.post('/delete', function(req, res) {
  var resData = {
    "success": false,
    "data": null
  }
  console.log(req.headers.email);
  var email = req.headers.email;
  con.query('Delete from employee where emp_email = ?', [email], function(err, result) {
    if (!err) {
      con.query('select * from employee', function(err, result) {
        if (!err) {
          if (result.length > 0) {
            resData.success = true;
            resData.data = result;
            res.send(resData);
          }

        } else {
          console.log(err);
          //con.end();
          res.send(resData);
        }

      });
    } else {
      console.log(err);
      //con.end();
      res.send(resData);
    }
  });
});

app.post('/UpdatePassword', function(req, res) {
  console.log("Calling Update Password");
  var resData = {
    "success": false,
    "data": null
  }
  var password = req.body.password;
  var email = req.body.email;
  console.log(email);
  console.log(password);
  con.query('update employee SET password = ? where emp_email=?', [password, email], function(err, rows, fields) {
    if (!err) {
      resData.success = true;
      res.send(resData);
    } else {
      console.log("update response from server");
      res.send(resData);
    }

  });

});


app.post('/save', function(req, res) {

  var resData = {
    "success": false,
    "data": null,
    "mail": false,
    "message": null
  }

  var ename = req.body.userData.name;
  var mob = req.body.userData.mobile;
  var pickup = req.body.userData.address;
  var email = req.body.userData.email;
  var username = req.body.userData.username;
  var password = "pass" + generateOTP();
  console.log("password" + password);
  var encryptedPassword = crypto.createHash('md5').update(password).digest("hex");
  // Saving to DB
  con.query('select * from employee where emp_email = ?', [email], function(err, rows, fields) {
    if (!err) {
      if (rows.length > 0) {
        resData.message = "Email Id Exist";
        res.send(resData);
      } else {
        con.query('insert into employee SET emp_name = ?, password = ? , emp_email=? , emp_mob = ? , pick_up = ? ', [ename, encryptedPassword, email, mob, pickup], function(err, result) {
          if (!err) {
            resData.success = true;
            resData.data = null;

            // Sending Mail after saving user to DB

            var mailOptions = {
              from: "sandeep.sidhardhan@cesltd.com",
              to: req.body.userData.email,
              subject: "Password For Ces-Cab Service App",
              text: "Hi " + ename + "\n\nYour account has been created, password for your account is : " + password
            }
            console.log(mailOptions);
            smtpTransport.sendMail(mailOptions, function(error, response) {
              if (error) {
                console.log(error);
                res.send(resData);
              } else {
                console.log("Message sent: " + response.message);
                resData.mail = true;
                res.send(resData);
              }
            });
          } else {
            console.log("Sign Up Error 1");
            console.log(err);
            res.send(resData);
          }
        });
      }
    } else {
      console.log("Sign Up Error 2");
      res.send(resData);
    }

  });
});

var generateOTP = function() {
  return Math.floor(Math.random() * 100000 + 1);
}

var server = app.listen(port, function() {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port);

});




//server.on('connection', function(socket) {
//  console.log("A new connection was made by a client.");
//  socket.setTimeout(30 * 1000);
//  // 30 second timeout. Change this as you see fit.
//})
