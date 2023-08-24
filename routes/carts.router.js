import { Router } from "express";
import CartManager from '../dao/CartManager.js'

const cartsRouter = Router();
const CM = new CartManager();

cartsRouter.post("/", async (req, res) => {
    const newCart = await CM.newCart();
    if (newCart) {
        res.send({status:"ok", message:"Carrito creado exitosamente!"});
    } else {
        res.status(500).send({status:"error", message:"Error! Hubo un problema al crear el carrito!"});
    }
});

cartsRouter.get("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const cart = await CM.getCart(cid);

    if (cart) {
        res.send({products:cart.products});
    } else {
        res.status(400).send({status:"error", message:"Error! No existe ningun carrito con ese ID!"});
    }
});

cartsRouter.post("/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const cart = await CM.getCart(cid);

    if (cart) {
        if (CM.addToCart(cid, pid)) {
            res.send({status:"ok", message:"Producto agregado al carrito!"});
        } else {
            res.status(400).send({status:"error", message:"Error! Hubo un problema al agregar el producto al carrito!"});
        }
    } else {
        res.status(400).send({status:"error", message:"Error! No existe ningun carrito con ese ID!"});
    }
});

export default cartsRouter;