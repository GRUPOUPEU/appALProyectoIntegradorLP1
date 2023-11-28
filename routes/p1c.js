var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');

/* listar. */
router.get('/', function (req, res, next) {

  dbConn.query('SELECT * FROM productos ORDER BY id asc', function (err, rows) {

    if (err) {
      req.flash('error', err);
      res.render('productos', { data: '' });
    } else {
      res.render('productos', { data: rows });
    }
  });
}); 



module.exports = router;
