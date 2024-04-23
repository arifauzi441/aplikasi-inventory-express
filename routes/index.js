var express = require('express');
var router = express.Router();
var connection = require(`../config/database`)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { username:``, password:`` });
});

router.post(`/login`, (req,res,next) => {
  let {password, username} = req.body
  connection.query(`select * from login`, (err, rows) => {
    if(err){
      console.log(err);
    }else{
      let userExist = rows.find(row => row.username == username)
      let pwExist = rows.find(row => row.password == password)
      if(!userExist){
        req.flash(`userWrong`, `username yang anda masukkan salah`)
        res.redirect(`/`)
        return false
      } 
      if(!pwExist){
        req.flash(`pwWrong`, `password yang anda masukkan tidak sesuai`)
        res.redirect(`/`)
        return false;
      }
      req.session.user = userExist
      console.log(req.session)
      res.redirect('/pegawai');
    }
  })
})

router.get(`/logout`, (req, res, next) => {
  req.session.destroy();
  res.redirect(`/`)
})

module.exports = router;
