var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');

/* listar. */
router.get('/', function (req, res, next) {

    dbConn.query('SELECT * FROM cliente ORDER BY id_customer desc', function (err, rows) {

        if (err) {
            req.flash('error', err);
            res.render('cliente/index', { data: '' });
        } else {
            res.render('cliente/index', { data: rows });
        }
    });
});

/*formulario para agregar */
router.get('/add', function (req, res, next) {
    res.render('cliente/add', {
        nombres: '',
        apellido: '',
        gmail: '',
        celular: '',
        dni: ''
    })
})

// add a new categoria
router.post('/add', function (req, res, next) {

    let nombres = req.body.nombres;
    let apellido = req.body.apellido;
    let gmail = req.body.gmail;
    let celular = req.body.celular;
    let dni = req.body.dni;
    let errors = false;

    if (nombres.length === 0) {
        errors = true;
        req.flash('error', "Please enter name ");
        // render to add.ejs with flash message
        res.render('cliente/add', {
            nombres: nombres,
            apellido: apellido,
            gmail: gmail,
            celular: celular,
            dni: dni

        })
    }

    // if no error
    if (!errors) {

        var form_data = {
            nombres: nombres,
            apellido: apellido,
            gmail: gmail,
            celular: celular,
            dni: dni,
        }
        // insert query
        dbConn.query('INSERT INTO cliente SET ?', form_data, function (err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                res.render('cliente/add', {
                    name: form_data.nombres,
                    apellido: form_data.apellido,
                    gmail: form_data.gmail,
                    celular: form_data.celular,
                    dni: form_data.dni
                })
            } else {
                req.flash('success', 'cliente successfully added');
                res.redirect('/cliente');
            }
        })
    }
})

// ver formulario editar
router.get('/edit/(:id_customer)', function (req, res, next) {
    let id_customer = req.params.id_customer;
    dbConn.query('SELECT * FROM cliente WHERE id_customer = ' + id_customer, function (err, rows, fields) {
        if (err) throw err
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Registro not found with id_customer = ' + id_customer)
            res.redirect('/cliente')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('cliente/edit', {
                id_customer: rows[0].id_customer,
                nombres: rows[0].nombres,
                apellido: rows[0].apellido,
                gmail: rows[0].gmail,
                celular: rows[0].celular,
                dni: rows[0].dni,
            })
        }
    })
})

// update categoria data
router.post('/update/:id_customer', function (req, res, next) {
    let id_customer = req.params.id_customer;
    let nombres = req.body.nombres;
    let apellido = req.body.apellido;
    let gmail = req.body.gmail;
    let celular = req.body.celular;
    let dni = req.body.dni;
    let errors = false;

    if (nombres.length === 0) {
        errors = true;
        // set flash message
        req.flash('error', "Please enter name ");
        // render to add.ejs with flash message
        res.render('cliente/edit', {
            id_customer: req.params.id_customer,
            nombres: nombres,
            apellido: apellido,
            gmail: gmail,
            celular: celular,
            dni: dni
        })
    }
    // if no error
    if (!errors) {
        var form_data = {
            nombres: nombres,
            apellido: apellido,
            gmail: gmail,
            celular: celular,
            dni: dni
        }
        // update query
        dbConn.query('UPDATE cliente SET ? WHERE id_customer = ' + id_customer, form_data, function (err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('cliente/edit', {
                    id_customer: req.params.id_customer,
                    nombres: form_data.nombres,
                    apellido: form_data.apellido,
                    gmail: form_data.gmail,
                    celular: form_data.celular,
                    dni: form_data.dni
                })
            } else {
                req.flash('success', 'cliente successfully updated');
                res.redirect('/cliente');
            }
        })
    }
})

// delete categorias
router.get('/delete/(:id_customer)', function (req, res, next) {
    let id_customer = req.params.id_customer;
    dbConn.query('DELETE FROM cliente WHERE id_customer= ' + id_customer, function (err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to books page
            res.redirect('/cliente')
        } else {
            // set flash message
            req.flash('success', 'Book successfully deleted! ID = ' + id_customer)
            // redirect to books page
            res.redirect('/cliente')
        }
    })
})


module.exports = router;
