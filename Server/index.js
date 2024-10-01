const express = require("express");
const http = require("http");
const mongoDb = require("./mongoDb");
const cors = require("cors");
const dotenv = require("dotenv");
const {Server} = require("socket.io");
const userRouter = require("./routes/user");
const User = require("./models/User");

const app = express();
const server = http.createServer(app);

const io = new Server (server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"],
        credentials:true,
    },
});

dotenv.config();
const port = process.env.PORT || 7000;

mongoDb();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials:true,
}));

app.use('/api/user',userRouter);

io.on("connection", (socket)=>{
    console.log('New client connected');

    socket.on("register-user", async(userId,toUserId)=>{
        // userSocketMap[userId] = socket.id;
        // console.log(userId,toUserId)
        const user=await User.findByIdAndUpdate(userId,{connectedTo:toUserId,socketId:socket.id});
        const toUser = await User.findById(toUserId);
        const targetSocketId = toUser.socketId;
        if(targetSocketId){
            io.to(targetSocketId).emit("update-user-status",{userId,status:true});
        }
    });
     
    socket.on ("private-message",async({ message, to, from })=>{
        const toUser = await User.findById(to);
        const user = await User.findById(from);
        // console.log(to,from)
        const targetSocketId=toUser.socketId;
        const senderName=user.username;
        console.log(senderName);
        if(targetSocketId){
            io.to(targetSocketId).emit("private-message",{message,senderName});
        }else{
            console.log(`User ${to} is not connected`);
        }
    })
    
    socket.on('out', async({userId,toUserId})=>{
        const toUser = await User.findById(toUserId);
        const targetSocketId = toUser.socketId;
        if(targetSocketId){
           await io.to(targetSocketId).emit('out',{userId,status:false});
        }
        try{
            // const userId = Object.keys(userSocketMap).find(userId=>userSocketMap[userId]===socket.id);
            if(userId){
                await User.findByIdAndUpdate(userId,{connectedTo:null,socketId:null})
                // delete userSocketMap[userId];
                console.log(`User ${userId} disconnected and removed from userSocketMap`);
            }
        }catch (err) {
            console.error("Error during disconnect:", err);
          }
    })
    socket.on("disconnect", async () => {
        try {
          const user = await User.findOne({ socketId: socket.id });

          if (user._id) {
            // Update the user's status to offline in the database
            // io.to(targetSocketId).emit("update-user-status", { userId, status: false });
            await User.findByIdAndUpdate(user._id, {connectedTo:null,socketId:null});
            console.log(`User ${userId} disconnected and removed from userSocketMap`);
          }
        } catch (err) {
          console.error("Error during disconnect:", err);
        }
      });
})

process.on('SIGINT', async () => {
    console.log("Server shutting down...");

    try {
        await User.updateMany({}, { connectedTo: null, socketId: null });
        console.log("All users' socketId and connectedTo fields cleared");
        process.exit(0);
    } catch (err) {
        console.error("Error during shutdown cleanup:", err);
        process.exit(1);
    }
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });