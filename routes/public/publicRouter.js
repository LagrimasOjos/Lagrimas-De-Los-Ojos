const express = require("express");
const router = express.Router();
const {
    paginaInicio,
    semillasDetallesPagina,
    aboutPage,
    contactoPage,
    noscript,
    contactPost,
} = require("../../controllers/public/publicController");
router.get("/", paginaInicio);
router.get("/about", aboutPage);
router.get("/contact", contactoPage);
router.get("/noscript", noscript);
router.get("/semilla/:id", semillasDetallesPagina);
router.post("/contactPost", contactPost);
module.exports = router;
