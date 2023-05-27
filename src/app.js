import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import NodeMediaServer from "node-media-server";
import { createLiveStream, deleteLiveStream } from "../utils/common";
import { Server } from "socket.io";
import http from "http";
import route from "./routes";

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 240,
  },
  http: {
    port: 8000,
    allow_origin: "*",
  },
};

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

export const sameio = io;

// Connect to Database new
mongoose.connect(
  process.env.DB_CON_STRING,
  { useNewUrlParser: true },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully Connected to the database");
    }
  }
);

app.use("/api", route);

server.listen(process.env.PORT);
console.log(`The magic happens at ${process.env.HOST}:${process.env.PORT}`);

const nms = new NodeMediaServer(config);
nms.run();

nms.on("ping", (id, args) => {
  console.log("[RTMP Server] Ping received:", id);
  // Handle ping event here
});

nms.on("prePublish", async (id, streamPath, args) => {
  await createLiveStream({ stream_id: id, stream_path: streamPath });
  sameio.emit("update_live", {
    action: "new_live",
    data: { stream_id: id, stream_path: streamPath },
  });
});

nms.on("donePublish", async (id, streamPath, args) => {
  await deleteLiveStream({ stream_id: id, stream_path: streamPath });
  sameio.emit("update_live", {
    action: "end_live",
    data: { stream_id: id, stream_path: streamPath },
  });
  console.log("[Node-Media-Server] Stream stopped:", streamPath);
});

io.on("connection", (client) => {
  console.log("connected");

  client.on("disconnect", () => {
    console.log(`client  disconnected`);
  });
});
