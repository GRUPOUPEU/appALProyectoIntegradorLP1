var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');

/* GET home page. */
router.get('/', function (req, res, next) {
  dbConn.query('SELECT * FROM productos ORDER BY id_product desc', function (err, rows) {

    if (err) {
      req.flash('error', err);
      res.render('index', { data: '' });
    } else {
      res.render('index', { data: rows });
    }
  });

});

      /* GET login page. */
      router.get('/login', function (req, res, next) {
        res.render('login');
      });

      /* GET login Administrador page. */
      router.get('/loginadmin', function (req, res, next) {
        res.render('loginadmin');
      });



      /* GET login catsala page. */
      router.get('/catsala', function (req, res, next) {
        res.render('catsala');
      });

      /* GET login catsala page. */
      router.get('/catcomedor', function (req, res, next) {
        res.render('catcomedor');
      });

      /* GET login catoficina page. */
      router.get('/catoficina', function (req, res, next) {
        res.render('catoficina');
      });

      /* GET login catoficina page. */
      router.get('/catdormitorio', function (req, res, next) {
        res.render('catdormitorio');
      });

      /* GET producto page. */
      router.get('/productos', function (req, res, next) {
        res.render('productos');
      });

      /* GET registrarse page. */
      router.get('/register', function (req, res, next) {
        res.render('register');
      })

      /* GET catalago page. */
      router.get('/catalogo', function (req, res, next) {
        res.render('catalogo');
      });

      /* GET servicio page. */
      router.get('/servicio', function (req, res, next) {
        res.render('servicio');
      });

      /* GET contacto page. */
      router.get('/contacto', function (req, res, next) {
        res.render('contacto');
      });

      /* GET carrito page. */
      router.get('/carrito', function (req, res, next) {
        res.render('carrito');
      });

      /* GET perfil page. */
      router.get('/profile', function (req, res, next) {
        res.render('profile');
      });

      router.get('/formulario', function (req, res, next) {
        res.render('formulario');
      });

/* post dashboard page. */
router.post('/dashboard', function (req, res, next) {
  email = req.body.email;
  password = req.body.password;
  dbConn.query("SELECT * FROM usuario WHERE email='" + email + "'AND password='" + password + "'", function (err, rows) {
    console.log(rows);
    if (err) {
      req.flash('error', err);
      console.log(err);
    } else {
      if (rows.length) {
        req.session.idu = rows[0]["id"];
        req.session.email = rows[0]["email"];
        req.session.loggedin = true;
        res.redirect('/dashboard');
      } else {
        req.flash('error', 'el usuario no existe');
        res.redirect('/')
      }
    }
  });
});

/* GET dashboard page. */
router.get('/dashboard', function (req, res, next) {
  if(!req.session.loggedin){
    res.redirect('/loginadmin')
  }else{
  res.render('dashboard');
  }
});

router.get('/logout',function(req,res){
  req.session.destroy();
  res.redirect("/");
});


module.exports = router;

