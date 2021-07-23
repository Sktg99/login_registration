var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'iwp_fat'
});
connection.connect(function(err){
if(!err) {
  // var sql = "CREATE TABLE users1 (user VARCHAR(255), password VARCHAR(255))";
  // connection.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log("Table created");
  // });
    console.log("Database is connected ...");
} else {
    console.log("Error connecting database ... ");
}
});
exports.register = async function(req,res){
  const password = req.body.password;
  const encryptedPassword = await bcrypt.hash(password, saltRounds)

  var users={
     "user":req.body.user,
     "password":encryptedPassword
   }
  
  connection.query('INSERT INTO users1 SET ?',users, function (error, results, fields) {
    if (error) {
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    } else {
      res.send({
        "code":200,
        "success":"user registered sucessfully"
          });
      }
  });
}
  exports.login = async function(req,res){
    var userr= req.body.user;
    var password = req.body.password;
    connection.query('SELECT * FROM users1 WHERE user = ?',[userr], async function (error, results, fields) {
      if (error) {
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        if(results.length >0){
          const comparision = await bcrypt.compare(password, results[0].password)
          if(comparision){
              res.send({
                "code":200,
                "success":"login sucessfull"
              })
          }
          else{
            res.send({
                 "code":204,
                 "success":"Email and password does not match"
            })
          }
        }
        else{
          res.send({
            "code":206,
            "success":"Email does not exits"
              });
        }
      }
      });
  }
