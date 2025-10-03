import { Router } from "express";
import { getConnection, sql } from "../config/db.js";

const router = Router();

router.get("/", async (req, res) => {
    try{
        const pool = await getConnection();
        const athletes = await pool.request()
            .query(`
                SELECT 
                    a.id,
                    a.dni,
                    a.nombre,
                    a.tiempo,
                    a.posicion,
                    a.ciudadId,
                    c.nombre as ciudadNombre
                FROM atletas a
                LEFT JOIN ciudades c
                    ON a.ciudadId = c.id
                ORDER BY a.posicion ASC
            `);
        res.json(athletes.recordset);
    }
    catch (err){
        res.status(500).send(err.message);
    }
});

router.get("/:id", async (req, res) => {
    try{
        const pool = await getConnection();
        const athlete = await pool.request()
            .input("id", sql.Int, req.params.id)
            .query(`
                SELECT TOP 1
                    a.id,
                    a.dni,
                    a.nombre,
                    a.tiempo,
                    a.posicion,
                    a.ciudadId,
                    c.nombre as ciudadNombre
                FROM atletas a
                LEFT JOIN ciudades c ON a.ciudadId = c.id
                WHERE a.id = @id
            `);
        
        if (athlete.recordset.length === 0) {
            return res.status(404).send("Atleta no encontrado");
        }
        
        res.json(athlete.recordset[0]);
    }
    catch (err){
        res.status(500).send(err.message);
    }
});

router.get("/ciudad/:ciudadId", async (req, res) => {
    try{
        const pool = await getConnection();
        const athletes = await pool.request()
            .input("ciudadId", sql.Int, req.params.ciudadId)
            .query(`
                SELECT 
                    a.id,
                    a.dni,
                    a.nombre,
                    a.tiempo,
                    a.posicion,
                    a.ciudadId,
                    c.nombre as ciudadNombre
                FROM atletas a
                LEFT JOIN ciudades c ON a.ciudadId = c.id
                WHERE a.ciudadId = @ciudadId
                ORDER BY a.posicion ASC
            `);
        res.json(athletes.recordset);
    }
    catch (err){
        res.status(500).send(err.message);
    }
});

router.post("/", async (req, res) => {
    const { dni, nombre, tiempo, posicion, ciudadId } = req.body;
    
    if (!dni || !nombre || !tiempo || !posicion || !ciudadId) {
        return res.status(400).send("Todos los campos son requeridos: dni, nombre, tiempo, posicion, ciudadId");
    }
    
    try{
        const pool = await getConnection();
        
        const cityExists = await pool.request()
            .input("ciudadId", sql.Int, ciudadId)
            .query("SELECT TOP 1 id FROM ciudades WHERE id = @ciudadId");
            
        if (cityExists.recordset.length === 0) {
            return res.status(400).send("La ciudad especificada no existe");
        }
        
        const dniExists = await pool.request()
            .input("dni", sql.Int, dni)
            .query("SELECT TOP 1 id FROM atletas WHERE dni = @dni");
            
        if (dniExists.recordset.length > 0) {
            return res.status(400).send("Ya existe un atleta con ese DNI");
        }

        const positionExists = await pool.request()
            .input("posicion", sql.Int, posicion)
            .query("SELECT TOP 1 id FROM atletas WHERE posicion = @posicion");

        if (positionExists.recordset.length > 0) {
            return res.status(400).send("Ya existe un atleta en esa posición");
        }
        
        await pool.request()
            .input("dni", sql.Int, dni)
            .input("nombre", sql.NVarChar, nombre)
            .input("tiempo", sql.NVarChar, tiempo)
            .input("posicion", sql.Int, posicion)
            .input("ciudadId", sql.Int, ciudadId)
            .query("INSERT INTO atletas (dni, nombre, tiempo, posicion, ciudadId) VALUES (@dni, @nombre, @tiempo, @posicion, @ciudadId)");
        
        res.status(201).send("Atleta creado/a correctamente.");
    }
    catch (err){
        res.status(500).send(err.message);
    }
});

router.put("/:id", async (req, res) => {
    const { dni, nombre, tiempo, posicion, ciudadId } = req.body;
    
    if (!dni || !nombre || !tiempo || !posicion || !ciudadId) {
        return res.status(400).send("Todos los campos son requeridos: dni, nombre, tiempo, posicion, ciudadId");
    }
    
    try{
        const pool = await getConnection();
        
        const athleteExists = await pool.request()
            .input("id", sql.Int, req.params.id)
            .query("SELECT TOP 1 id FROM atletas WHERE id = @id");
            
        if (athleteExists.recordset.length === 0) {
            return res.status(404).send("Atleta no encontrado");
        }
        
        const cityExists = await pool.request()
            .input("ciudadId", sql.Int, ciudadId)
            .query("SELECT TOP 1 id FROM ciudades WHERE id = @ciudadId");
            
        if (cityExists.recordset.length === 0) {
            return res.status(400).send("La ciudad especificada no existe");
        }

        const positionExists = await pool.request()
            .input("posicion", sql.Int, posicion)
            .input("id", sql.Int, req.params.id)
            .query(`SELECT TOP 1 id
                    FROM atletas
                    WHERE posicion = @posicion
                    AND id != @id`);

        if (positionExists.recordset.length > 0) {
            return res.status(400).send("Ya existe un atleta en esa posición");
        }
        
        const dniExists = await pool.request()
            .input("dni", sql.Int, dni)
            .input("id", sql.Int, req.params.id)
            .query("SELECT TOP 1 id FROM atletas WHERE dni = @dni AND id != @id");
            
        if (dniExists.recordset.length > 0) {
            return res.status(400).send("Ya existe otro atleta con ese DNI");
        }
        
        await pool.request()
            .input("dni", sql.Int, dni)
            .input("nombre", sql.NVarChar, nombre)
            .input("tiempo", sql.NVarChar, tiempo)
            .input("posicion", sql.Int, posicion)
            .input("ciudadId", sql.Int, ciudadId)
            .input("id", sql.Int, req.params.id)
            .query("UPDATE atletas SET dni = @dni, nombre = @nombre, tiempo = @tiempo, posicion = @posicion, ciudadId = @ciudadId WHERE id = @id");
        
        res.send("Atleta actualizado/a correctamente.");
    }
    catch (err){
        res.status(500).send(err.message);
    }
});

router.delete("/:id", async (req, res) => {
    try{
        const pool = await getConnection();
        
        const athleteExists = await pool.request()
            .input("id", sql.Int, req.params.id)
            .query("SELECT TOP 1 nombre FROM atletas WHERE id = @id");
            
        if (athleteExists.recordset.length === 0) {
            return res.status(404).send("Atleta no encontrado");
        }
        
        await pool.request()
            .input("id", sql.Int, req.params.id)
            .query("DELETE FROM atletas WHERE id = @id");

        res.send("Atleta eliminado/a correctamente.");
    }
    catch (err){
        res.status(500).send(err.message);
    }
});

export default router;
