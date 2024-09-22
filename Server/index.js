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

const userSocketMap = {};

io.on("connection", (socket)=>{
    console.log('New client connected');

    socket.on("register-user", async(userId,toUserId)=>{
        const targetSocketId = userSocketMap[toUserId];
        await User.findByIdAndUpdate(userId,{connectedTo:toUserId});
        userSocketMap[userId] = socket.id;
        if(targetSocketId){
            io.to(targetSocketId).emit("update-user-status",{userId,status:true});
        }
    });
     
    socket.on ("private-message",(message,to,from)=>{
        const targetSocketId=userSocketMap[to];
        if(targetSocketId){
            io.to(targetSocketId).emit("private-message",{message,from});
        }else{
            console.log(`User ${to} is not connected`);
        }
    })
    
    socket.on('out', async({userId,toUserId})=>{
        const targetSocketId = userSocketMap[toUserId];
        if(targetSocketId){
           await io.to(targetSocketId).emit('out',{userId,status:false});
        }
        try{
            const userId = Object.keys(userSocketMap).find(userId=>userSocketMap[userId]===socket.id);
            if(userId){
                await User.findByIdAndUpdate(userId,{connectedTo:null})
                delete userSocketMap[userId];
                console.log(`User ${userId} disconnected and removed from userSocketMap`);
            }
        }catch (err) {
            console.error("Error during disconnect:", err);
          }
    })
})

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });