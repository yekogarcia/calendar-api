const { response } = require('express');
const Evento = require("../models/Evento");

const getEventos = async (req, res = response) => {

    const eventos = await Evento.find().populate('user', 'name email');

    res.status(400).json({
        ok: true,
        msg: eventos
    });
}

const crearEventos = async (req, res = response) => {

    const evento = new Evento(req.body);

    try {
        evento.user = req.id;

        const eventoGuardado = await evento.save();

        res.json({
            ok: true,
            evento: eventoGuardado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error Comuniquese con el administrador"
        })

    }

}

const actualizarEventos = async (req, res = response) => {

    const eventoId = req.params.id;
    const id = req.id;

    try {
        const evento = await Evento.findById(eventoId)

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: "El evento no se ecuentra registrado con ese Id"
            });
        }

        if (evento.user.toString() !== id) {
            return res.status(401).json({
                ok: false,
                msg: "El usuario no tiene permisos para actualizar el evento"
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: id
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true });

        res.json({
            ok: true,
            msg: eventoActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error comuniquese con el administrador"
        });
    }

}

const eliminarEventos = async(req, res = response) => {

    const eventoId = req.params.id;
    const id = req.id;

    try {
        const evento = await Evento.findById(eventoId)

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: "El evento no se ecuentra registrado con ese Id"
            });
        }

        if (evento.user.toString() !== id) {
            return res.status(401).json({
                ok: false,
                msg: "El usuario no tiene permisos para eliminar el evento"
            })
        }
        await Evento.findByIdAndDelete(eventoId);

        res.json({
            ok: true,
            msg: "Evento eliminado correctamente"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error comuniquese con el administrador"
        });
    }
}

module.exports = {
    getEventos,
    crearEventos,
    actualizarEventos,
    eliminarEventos
}