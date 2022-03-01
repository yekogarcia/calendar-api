/*
   Rutas de usuarios /Auth
   host + /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { createUsers, loginUsers, renewToken } = require('../contollers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


router.post('/new',
    [// middlewares
        check('name', 'El name es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe ser de 6 characters').isLength({ min: 6 }),
        validarCampos
    ],
    createUsers);

router.post('/',
    [// middlewares
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe ser de 6 characters').isLength({ min: 6 }),
        validarCampos
    ],
    loginUsers);

router.get('/renew', validarJWT, renewToken);


module.exports = router;