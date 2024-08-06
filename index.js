import express from "express"; // Importa el framework Express
import fs from "fs"; // Importa el módulo del sistema de archivos
import bodyParser from "body-parser"; // Importa el middleware para parsear el cuerpo de las solicitudes

const app = express(); // Crea una instancia de una aplicación Express
app.use(bodyParser.json()); // Usa bodyParser para parsear cuerpos de solicitudes JSON

/**
 * Lee los datos desde el archivo db.json
 * @returns {Object} Los datos leídos del archivo JSON
 */
const readData = () => {
  try {
    const data = fs.readFileSync("./db.json"); // Lee el archivo db.json de forma síncrona
    return JSON.parse(data); // Parsea el contenido del archivo JSON y lo retorna
  } catch (error) {
    console.error(error); // Muestra el error en la consola si ocurre
  }
};

/**
 * Escribe los datos al archivo db.json
 * @param {Object} data - Los datos a escribir en el archivo JSON
 */
const writeData = (data) => {
  try {
    fs.writeFileSync("./db.json", JSON.stringify(data, null, 2)); // Escribe los datos al archivo db.json
  } catch (error) {
    console.error(error); // Muestra el error en la consola si ocurre
  }
};

/**
 * Maneja las solicitudes GET a la ruta /games
 * Retorna una lista de todos los juegos
 */
app.get("/games", (req, res) => {
  const data = readData(); // Lee los datos desde el archivo
  res.json(data.games); // Retorna la lista de juegos como una respuesta JSON
});

/**
 * Maneja las solicitudes GET a la ruta /games/:id
 * Retorna los detalles de un juego específico por ID
 */
app.get("/games/:id", (req, res) => {
  const data = readData(); // Lee los datos desde el archivo
  const id = parseInt(req.params.id, 10); // Parsea el ID del parámetro de ruta
  const game = data.games.find((game) => game.id === id); // Encuentra el juego por ID

  if (game) {
    res.json(game); // Retorna el juego si se encuentra
  } else {
    res.status(404).json({ message: "Game not found" }); // Retorna un error 404 si no se encuentra
  }
});

/**
 * Maneja las solicitudes POST a la ruta /games
 * Crea un nuevo juego y lo agrega a la lista
 */
app.post("/games", (req, res) => {
  const data = readData(); // Lee los datos desde el archivo
  const body = req.body; // Obtiene el cuerpo de la solicitud
  const newGame = {
    id: data.games.length > 0 ? data.games[data.games.length - 1].id + 1 : 1, // Calcula el nuevo ID
    ...body, // Agrega los datos del cuerpo de la solicitud
  };
  data.games.push(newGame); // Agrega el nuevo juego a la lista
  writeData(data); // Escribe los datos actualizados al archivo
  res.status(201).json(newGame); // Retorna el nuevo juego creado
});

/**
 * Maneja las solicitudes PUT a la ruta /games/:id
 * Actualiza los detalles de un juego específico por ID
 */
app.put("/games/:id", (req, res) => {
  const data = readData(); // Lee los datos desde el archivo
  const body = req.body; // Obtiene el cuerpo de la solicitud
  const id = parseInt(req.params.id, 10); // Parsea el ID del parámetro de ruta
  const gameIndex = data.games.findIndex((game) => game.id === id); // Encuentra el índice del juego por ID

  if (gameIndex !== -1) {
    data.games[gameIndex] = {
      ...data.games[gameIndex], // Mantiene los datos existentes del juego
      ...body, // Sobrescribe con los datos nuevos
    };
    writeData(data); // Escribe los datos actualizados al archivo
    res.json({ message: "Game updated successfully" }); // Retorna un mensaje de éxito
  } else {
    res.status(404).json({ message: "Game not found" }); // Retorna un error 404 si no se encuentra el juego
  }
});

/**
 * Maneja las solicitudes DELETE a la ruta /games/:id
 * Elimina un juego específico por ID
 */
app.delete("/games/:id", (req, res) => {
  const data = readData(); // Lee los datos desde el archivo
  const id = parseInt(req.params.id, 10); // Parsea el ID del parámetro de ruta
  const gameIndex = data.games.findIndex((game) => game.id === id); // Encuentra el índice del juego por ID

  if (gameIndex !== -1) {
    data.games.splice(gameIndex, 1); // Elimina el juego de la lista
    writeData(data); // Escribe los datos actualizados al archivo
    res.json({ message: "Game deleted successfully" }); // Retorna un mensaje de éxito
  } else {
    res.status(404).json({ message: "Game not found" }); // Retorna un error 404 si no se encuentra el juego
  }
});

// Inicia el servidor en el puerto 3000
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
