import express from "express";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.routes.js";
import {Server} from "socket.io";
import ProductManager from "./dao/ProductManager.js";
import mongoose from "mongoose";
import chatManager from "./dao/chatManager.js";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log("Servidor Activo en el puerto: " + PORT);
});

const socketServer = new Server(httpServer);
const CM = new chatManager();
const PM = new ProductManager();

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api/products/", productsRouter);
app.use("/api/carts/", cartsRouter);
app.use("/", viewsRouter);

mongoose.connect("mongodb+srv://tomastauber:ZWx5dcTbW71K5hk4@tomascluster.tkfwypg.mongodb.net/e-commerce?retryWrites=true&w=majority");

socketServer.on("connection", (socket) => {
    console.log("Se ha iniciado una nueva conexión!");

    const products = PM.getProducts();
    socket.emit("realTimeProducts", products);

    socket.on("nuevoProducto", (data) => {
        const product = {title:data.title, description:"", code:"", price:data.price, status:"", stock:10, category:"", thumbnails:data.thumbnails};
        PM.addProduct(product);
        const products = PM.getProducts();
        socket.emit("realTimeProducts", products);
    });

    socket.on("eliminarProducto", (data) => {
        PM.deleteProduct(parseInt(data));
        const products = PM.getProducts();
        socket.emit("realTimeProducts", products);
    });

    socket.on("newMessage", async (data) => {
        CM.createMessage(data);
        const messages = await CM.getMessages();
        socket.emit("messages", messages);
    });
});