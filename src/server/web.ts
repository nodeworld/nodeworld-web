import { app } from "./app";

const HOST = process.env.HOST ? process.env.HOST : "localhost";
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.listen(PORT, HOST, () => {
    console.log(`Nodeworld Web is now listening on ${HOST}:${PORT}...`);
});