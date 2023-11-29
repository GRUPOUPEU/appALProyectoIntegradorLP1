var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');

// Función para obtener todos los productos o realizar una búsqueda
function getProducts(req, res, next, searchTerm = '') {
  const query = searchTerm
    ? 'SELECT * FROM productos WHERE nombre LIKE ? ORDER BY id_product ASC'
    : 'SELECT * FROM productos ORDER BY id_product ASC';

  dbConn.query(query, searchTerm ? [`%${searchTerm}%`] : [], function (err, rows) {
    if (err) {
      req.flash('error', err);
      res.render('productos', { data: '' });
    } else {
      res.render('productos', { data: rows });
    }
  });
}

// Ruta para listar todos los productos
router.get('/', function (req, res, next) {
  getProducts(req, res, next);
});

// Ruta para realizar busquueda
router.get('/search', function (req, res, next) {
  const searchTerm = req.query.q;
  getProducts(req, res, next, searchTerm);
});

module.exports = router;



module.exports = router;
