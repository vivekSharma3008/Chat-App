const express = require("express");
const dotenv = require("dotenv")
const app = express();
const connectDB = require("./config/db")
const userRoutes = require("./routes/userRoutes")
const messageRoutes = require("./routes/messageRoutes");
const {notFound, errorHandler} = require("./midlleware/errorMiddleware")
const chatRoutes = require("./routes/chatRoute")
const path = require("path")
const cors = require("cors")

app.use(cors());


dotenv.config();

connectDB();


app.use(express.json());
 
// app.get('/', (req, res)=>{ 
//     res.send("Api is running succesfully");  
// })
 
app.use('/api/user', userRoutes); 
app.use('/api/chat', chatRoutes);     
app.use("/api/message", messageRoutes);


// --------------------------deployment------------------------------

const __dirname1 = path.resolve();
console.log(process.env.NODE_ENV )
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "frontend/build")));

  // app.get("*", (req, res) =>{
  // console.log(path.resolve(__dirname1, "frontend", "build", "index.html");
  //   res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html");
  // };

  app.get("*", (req, res)=>{
    // console.log("hey", path.resolve(path.join(__dirname1, "../"), "frontend", "build", "index.html"));
    // console.log(path.join(__dirname1, "../"));
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  })
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------

app.use(notFound);
app.use(errorHandler)



const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(`Server running on PORT ${PORT}...`)
  );

const io = require("socket.io")(server, { 
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:3000",
      // credentials: true,
    },
  });
  
  io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });
  
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  
    socket.on("new message", (newMessageRecieved) => {
      var chat = newMessageRecieved.chat;
  
      if (!chat.users) return console.log("chat.users not defined");
  
      chat.users.forEach((user) => {
        if (user._id == newMessageRecieved.sender._id) return;
  
        socket.in(user._id).emit("message recieved", newMessageRecieved);
      });
    });
  
    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
  });