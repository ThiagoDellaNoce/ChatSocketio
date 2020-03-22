const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use("/", (req, res) => {
  res.render("index.html");
});

// banco de mensagens
let authors = [];
let messages = [];
let track = 'l7vuDjL1lik';

// socket
io.on("connection", socket => {
  console.log(`Socket conectado: ${socket.id}`);

  socket.emit("previousMessages", messages);
  socket.emit("selecTrack", track);

  socket.on("setTrack", data => {
    console.log(data)
    track = data;

    socket.broadcast.emit("seleTrack", data);
  });

  socket.on("sendMessage", data => {
    authors.push(data.author);
    messages.push(data);

    //sinc todo mundo
    socket.broadcast.emit("receivedMessage", data);
  });
});

server.listen(process.env.PORT || 3000);
