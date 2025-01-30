const express = require("express");
const router = express.Router();
const {
    paginaInicio,
    semillasDetallesPagina,
    aboutPage,
    contactoPage,
    noscript,
} = require("../../controllers/public/publicController");
router.get("/", paginaInicio);
router.get("/about", (req, res) => {
    return res.view("public/about", { title: "Sobre nosotros" });
});
router.get("/contact", (req, res) => {
    return res.view("public/contact", { title: "Contacto" });
});
router.get("/noscript", noscript);
router.get("/semilla/:id", semillasDetallesPagina);
module.exports = router;
