var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');

/* GET users listing.  */
router.get('/', function (req, res, next) {
  dbConn.query('SELECT productos.id_product, productos.nombre AS nombre, productos.descripcion, productos.foto, productos.stock, productos.precio, categorias.nombre AS nombre_categoria FROM productos JOIN categorias ON productos.id_categoria = categorias.id_category', function (err, rows) {
    if (err) {
      req.flash('error', err);
      res.render('producto/index', { data: '' });
    } else {
      res.render('producto/index', { data: rows });
    }
  });
});

// Ruta para renderizar formulario de agregar
router.get('/add', function (req, res, next) {
  // Obtén la lista de categorías desde la base de datos
  dbConn.query('SELECT id_category, nombre FROM categorias', function (err, categorias) {
    if (err) {
      req.flash('error', err);
      res.render('producto/add', { categorias: '', nombre: '', descripcion: '', foto: '', stock: '', precio: '' });
    } else {
      res.render('producto/add', { categorias: categorias, nombre: '', descripcion: '', foto: '', stock: '', precio: '' });
    }
  });
});



// add a new producto
router.post('/add', function (req, res, next) {

  let nombre = req.body.nombre;
  let descripcion = req.body.descripcion;
  let foto = req.body.foto;
  let stock = req.body.stock;
  let precio = req.body.precio;
  let id_categoria = req.body.id_categoria;
  let errors = false;

  if (nombre.length === 0) {
    errors = true;
    req.flash('error', "Please enter name ");
    // render to add.ejs with flash message
    res.render('producto/add', {
      id_categoria:id_categoria,
      nombre: nombre,
      descripcion: descripcion,
      foto: foto,
      stock: stock,
      precio: precio
    })
  }

  // if no error
  if (!errors) {

    var form_data = {
      id_categoria:id_categoria,
      nombre: nombre,
      descripcion: descripcion,
      foto: foto,
      stock: stock,
      precio: precio
    }
    // insert query
    dbConn.query('INSERT INTO productos SET ?', form_data, function (err, result) {
      //if(err) throw err
      if (err) {
        req.flash('error', err)
        res.render('producto/add', {
          id_categoria: form_data.id_categoria,
          nombre: form_data.nombre,
          descripcion: form_data.dsescripcion,
          foto: form_data.foto,
          stock: form_data.stock,
          precio: form_data.precio
        })
      } else {
        req.flash('success', 'producto successfully added');
        res.redirect('/producto');
      }
    })
  }
})

// ver formulario editar
router.get('/edit/(:id_product)', function (req, res, next) {
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

// update categoria data
router.post('/update/:id_product', function (req, res, next) {
  let id_product = req.params.id_product;
  let nombre = req.body.nombre;
  let descripcion = req.body.descripcion;
  let foto = req.body.foto;
  let stock = req.body.stock;
  let precio = req.body.precio;
  let errors = false;

  if (nombre.length === 0) {
    errors = true;
    // set flash message
    req.flash('error', "Please enter name ");
    // render to add.ejs with flash message
    res.render('producto/edit', {
      id_product: req.params.id_product,
      nombre: nombre,
      descripcion: descripcion,
      foto: foto,
      stock: stock,
      precio: precio
    })
  }
  // if no error
  if (!errors) {
    var form_data = {
      nombre: nombre,
      descripcion: descripcion,
      foto: foto,
      stock: stock,
      precio: precio
    }
    // update query
    dbConn.query('UPDATE productos SET ? WHERE id_product = ' + id_product, form_data, function (err, result) {
      //if(err) throw err
      if (err) {
        // set flash message
        req.flash('error', err)
        // render to edit.ejs
        res.render('producto/edit', {
          id_product: req.params.id_product,
          nombre: form_data.nombre,
          descripcion: form_data.descripcion,
          foto: form_data.foto,
          stock: form_data.stock,
          precio: form_data.precio
        })
      } else {
        req.flash('success', 'productos successfully updated');
        res.redirect('/producto');
      }
    })
  }
})

// delete producto
router.get('/delete/(:id_product)', function (req, res, next) {
  let id_product = req.params.id_product;
  dbConn.query('DELETE FROM productos WHERE id_product = ' + id_product, function (err, result) {
    //if(err) throw err
    if (err) {
      // set flash message
      req.flash('error', err)
      // redirect to books page
      res.redirect('/producto')
    } else {
      // set flash message
      req.flash('success', 'producto successfully deleted! ID = ' + id_product)
      // redirect to books page
      res.redirect('/producto')
    }
  })
})


module.exports = router;