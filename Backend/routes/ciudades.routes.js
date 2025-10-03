import { Router } from "express";
import { getConnection, sql } from "../config/db.js";

const router = Router();

router.get("/", async (req, res) => {
    try{
        const pool = await getConnection();
        const cities = await pool.request()
            .query(`SELECT 
                        id,
                        nombre
                    FROM ciudades`);
        res.json(cities.recordset);
    }
    catch (err){
        res.status(500).send(err.message);
    }
});

router.get("/:id", async (req, res) => {
    try{
        const pool = await getConnection();
        const city = await pool.request()
            .input("id", sql.Int, req.params.id)
            .query(`SELECT TOP 1
                        id,
                        nombre
                    FROM ciudades
                    WHERE id = @id
            `);
        
        if (city.recordset.length === 0) {
            return res.status(404).json("Ciudad no encontrada");
        }
        
        res.json(city.recordset[0]);
    }
    catch (err){
        res.status(500).send(err.message);
    }
});

router.post("/", async (req, res) => {
    const { nombre } = req.body;
    try {
        const pool = await getConnection();

        const cityExists = await pool.request()
            .input("nombre", sql.NVarChar, nombre)
            .query("SELECT TOP 1 id FROM ciudades WHERE nombre = @nombre");

        if (cityExists.recordset.length > 0) {
            return res.status(400).json("Ya existe una ciudad con ese nombre.");
        }

        await pool.request()
            .input("nombre", sql.NVarChar, nombre)
            .query("INSERT INTO ciudades (nombre) VALUES (@nombre)");
        
        res.send("Ciudad creada correctamente.");
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

router.put("/:id", async (req, res) => {
    const { nombre } = req.body;
    try{
        const pool = await getConnection();
        
        const cityExists = await pool.request()
            .input("id", sql.Int, req.params.id)
            .query("SELECT TOP 1 id FROM ciudades WHERE id = @id");

        if (cityExists.recordset.length === 0) {
            return res.status(404).json("Ciudad no encontrada");
        }
        
        await pool.request()
            .input("nombre", sql.NVarChar, nombre)
            .input("id", sql.Int, req.params.id)
            .query("UPDATE ciudades SET nombre = @nombre WHERE id = @id");
        
        res.send("Ciudad actualizada correctamente.");
    }
    catch (err){
        res.status(500).send(err.message);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const pool = await getConnection();
        
        const cityExists = await pool.request()
            .input("id", sql.Int, req.params.id)
            .query("SELECT TOP 1 id FROM ciudades WHERE id = @id");

        if (cityExists.recordset.length === 0) {
            return res.status(404).json("Ciudad no encontrada");
        }

        const atletasAsociados = await pool.request()
            .input("id", sql.Int, req.params.id)
            .query("SELECT TOP 1 id FROM atletas WHERE ciudadId = @id");

        if (atletasAsociados.recordset.length > 0) {
            return res.status(400).json("No se puede eliminar la ciudad porque existen atletas asociados a ella.");
        }

        await pool.request()
            .input("id", sql.Int, req.params.id)
            .query("DELETE FROM ciudades WHERE id = @id");

        res.send("Ciudad eliminada correctamente.");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

export default router;