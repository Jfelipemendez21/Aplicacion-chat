// Este código define un modelo de datos para la base de datos MongoDB.
import mongoose from "mongoose"


// Schema es un objeto que define la estructura de los documentos que se guardarán en una colección de MongoDB. Es decir, establece los campos y el tipo de datos que cada documento tendrá en esa colección

const Schema= mongoose.Schema;

const mensajeSchema= new Schema({
    message: String,
    from: String
});


// El model es una clase que se utiliza para interactuar con una colección específica en la base de datos. 
export default mongoose.model("Message",mensajeSchema);