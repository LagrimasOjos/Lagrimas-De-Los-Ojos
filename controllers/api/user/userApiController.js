const Prestamo = require("../../../models/db/prestamos");
const Reserva = require("../../../models/db/reservas");
const prestamosUser = async (req, res) => {
   try {
      const prestamos = await Prestamo.prestamosUserId(req.session.userId);
      return res.json({ data: prestamos, error: null });
   } catch (error) {
      return res.json({ data: null, error: "err" });
   }
};

const reservarId = async (req, res) => {
   try {
      if (!req.body.amountSeeds || !req.params.id) throw new Error("Es necesario expecificar la cantidad o la semilla id");
      await Reserva.crearReservas(req.params.id, req.session.userId, req.body.amountSeeds);
      return res.json({ status: true });
   } catch (e) {
      res.status(500);
      return res.json({ status: false });
   }
}

const ultimoPrestamoActualizado = async (req, res) => {
   try {

      if (!req.body.fechaIndexDb) throw new Error("Hubo un error");

      const fechaIndexDb = new Date(req.body.fechaIndexDb);

      const ultimoRegistro = await Prestamo.findOne({ idUser: req.session.userId }).sort({ updatedAt: -1 });

      if (ultimoRegistro && (fechaIndexDb.getTime() !== ultimoRegistro.updatedAt.getTime())) {
         const prestamos = await Prestamo.prestamosUserId(req.session.userId);
         return res.json({ data: prestamos, error: null });
      } else {
         return res.json({ data: [], error: null });
      }
   } catch (error) {
      console.error(error);
      return res.json({ data: null, error: "err" });
   }
};

module.exports = { prestamosUser, ultimoPrestamoActualizado, reservarId};
