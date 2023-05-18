import Message from "../models/message.js";


const controller = {

    save: (req, res) => {
        
        // contiene los datos del cuerpo de la solicitud
        const params = req.body;
        
        const mensaje = new Message();
        mensaje.message = params.message;
        mensaje.from = params.from;


        // el metodo save es para guardar el objeto en la base de datos 
        mensaje.save()
            .then(messageStored => {
            res.status(200).send({ message: messageStored })
          })
            .catch(err => {
            res.status(500).send({ message: `Error al guardar el mensaje: ${err}` })
              })

    },

    getMessage: (req, res) => {
        // se crea una consulta para obtener todos los mensajes
        const query = Message.find({})
         
        // se ordenan por ID de forma descendente, se ejecuta la consulta y se devuelve el resultado en la respuesta.
        query.sort("-_id").exec((err, mess) => {
            if (err) {
                return res.status(500).send({
                    status: "Error",
                    message: "Error al extraer los datos"
                })
            }

            if (!mess) {
                return res.status(404).send({
                    status: "Error",
                    message: "No hay mensajes que mostrar"
                })
            }

            return res.status(200).send({
                status: "Success",
                mess
            })
        })

    }
}

export default controller