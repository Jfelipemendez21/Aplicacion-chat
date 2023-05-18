import express from "express"
import controller from "../controllers/message.js"


const router = express.Router();

// Se asocia cada ruta a una función controladora que se encargará de procesar las solicitudes que lleguen a cada una de ellas

router.post("/save", controller.save)
router.get("/message", controller.getMessage)

export default router 