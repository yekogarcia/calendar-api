const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/User')
const { generarJWT } = require('../helpers/jwt')

const createUsers = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: "El email ya existe registrado en otro usuario!"
            });
        }

        usuario = new Usuario(req.body);

        //Encryptar pass
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            msg: "registro",
            id: usuario.id,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Por favor comuniquese con el administrador!"
        });
    }
}

const loginUsers = async (req, res) => {

    const { email, password } = req.body;

    try {
        console.log('email ', email)
        let usuario = await Usuario.findOne({ email });

        //confirm pass
        const validPassword = bcrypt.compareSync(password, usuario.password)
        if (!validPassword || !usuario) {
            return res.status(400).json({
                ok: false,
                msg: "El usuario o password es incorrecta!"
            });
        }
        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            msg: "success",
            id: usuario.id,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Por favor comuniquese con el administrador!"
        });
    }


}

const renewToken = async (req, res = response) => {

    const { id, name } = req;

    //generate new JWT
    const token = await generarJWT(id, name);

    res.json({
        ok: true,
        id,
        name,
        token
    });
}

module.exports = {
    createUsers,
    loginUsers,
    renewToken
}