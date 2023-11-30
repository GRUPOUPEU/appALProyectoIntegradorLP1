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

router.get('/agregar/(:id_product)', function (req, res, next) {
  let id_product = req.params.id_product;
  dbConn.query('SELECT * FROM productos WHERE id_product = ' + id_product, function (err, rows, fields) {
    if (err) throw err
    // if user not found
    if (rows.length <= 0) {
      req.flash('error', 'Registro not found with id_product = ' + id_product)
      res.redirect('/producto')
    }
    // if book found
    else {
      // render to edit.ejs
      res.render('producto/edit', {
        id_product: rows[0].id_product,
        nombre: rows[0].nombre,
        descripcion: rows[0].descripcion,
        foto: rows[0].foto,
        stock: rows[0].stock,
        precio: rows[0].precio,
        id_categoria: rows[0].id_categoria
      })
    }
  })
})

router.get('/catsalas', function (req, res, next) {
  // Realiza la búsqueda en la base de datos solo para la categoría "catsalas"
  const query = 'SELECT productos.nombre AS nombre_producto, foto ,precio,id_product,categorias.nombre FROM productos JOIN categorias ON productos.id_categoria = categorias.id_category WHERE categorias.nombre = "cat salas"  ORDER BY id_product ASC';
  dbConn.query(query, function (err, rows) {
    if (err) {
      req.flash('error', err);
      res.render('catsala', { data: '' });
    } else {
      res.render('catsala', { data: rows });
    }
  });
});




module.exports = router;
