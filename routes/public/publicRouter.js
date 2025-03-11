const express = require("express");
const router = express.Router();
const {
    paginaInicio,
    semillasDetallesPagina,
    aboutPage,
    contactoPage,
    noscript,
    contactPost,
    paginaInicioDragAndDrop,
} = require("../../controllers/public/publicController");
router.get("/", paginaInicio);
router.get("/drag", paginaInicioDragAndDrop);
router.get("/about", aboutPage);
router.get("/contact", contactoPage);
router.get("/noscript", noscript);
//router.get("/semilla/:id", semillasDetallesPagina);
router.post("/contactPost", contactPost);
module.exports = router;
