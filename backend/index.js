const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");

connectToMongo(); //asynchrounous nature ....first server will run and then connection with mongo establisheds
const app = express();
const port = 4000;

app.use(cors()); //so that our api's can fetch with other port localhost/5000
app.use(express.json()); //middle ware which is used to send json in request body by using content type header

// Available routes
app.get("/", (res, req) => {
  res.send("Hello World");
});
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`iNotebook app listening on https://localhost/${port}`);
});
