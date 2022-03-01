
/*
   Event Routes
   api/events
*/

const { Router } = require("express");
const { check } = require('express-validator');

const { getEventos, crearEventos, actualizarEventos, eliminarEventos } = require("../contollers/event");
const { isDate } = require("../helpers/isDate");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

//Todas las rutas pasaran por validacion JWT
router.use(validarJWT);

router.get("/", getEventos);

router.post("/",
    [
        check('title', "El titulo es obligatorio").not().isEmpty(),
        check('start', "Fecha de inicio obligatoria").custom(isDate),
        check('end', "Fecha fin  obligatoria").custom(isDate),
        validarCampos
    ],
    crearEventos);

router.put("/:id",
    [
        check('title', "El titulo es obligatorio").not().isEmpty(),
        check('start', "Fecha de inicio obligatoria").custom(isDate),
        check('end', "Fecha fin  obligatoria").custom(isDate),
        validarCampos
    ],
    actualizarEventos);

router.delete("/:id", eliminarEventos);


module.exports = router;