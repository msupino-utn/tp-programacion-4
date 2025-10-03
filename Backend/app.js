import "dotenv/config";
import express from "express";
import cors from "cors";
import rutasCiudades from "./routes/ciudades.routes.js";
import rutasAtletas from "./routes/atletas.routes.js";

const server = express();

const frontendUrl = process.env.FRONTEND_URL;

server.use(cors({
    origin: frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

server.use(express.json());

server.use("/ciudades", rutasCiudades);
server.use("/atletas", rutasAtletas);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("Servidor web corriendo en puerto: " + PORT);
});