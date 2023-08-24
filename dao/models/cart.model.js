import mongoose from "mongoose";
import cartsRouter from "../../routes/carts.router.js";

const cartSchema = new mongoose.Schema({
    id: Number,
    products: Array
});

export const cartModel = mongoose.model("carts", cartSchema);