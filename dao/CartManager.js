import { cartModel } from "./models/cart.model.js";

class cartManager {

    async newCart() {
        console.log("Carrito creado correctamente!");
        return await cartModel.create({ products: [] });
    }

    async getCart(id) {
        try {
            return await cartModel.findOne({ _id: id }) || null;
        } catch (error) {
            console.log("No existe ningún carrito con ese Id!");
            return null;
        }
    }

    async getCarts() {
        return await cartModel.find().lean();
    }

    async addToCart(cid, pid) {
        try {
            if (await cartModel.exists({ _id: cid, products: { $elemMatch: { product: pid } } })) {
                await cartModel.updateOne({ _id: cid, products: { $elemMatch: { product: pid } } }, { $inc: { "products.$.quantity": 1 } }, { new: true, upsert: true });
            } else {
                await cartModel.updateOne({ _id: cid }, { $push: { products: { "product": pid, "quantity": 1 } } }, { new: true, upsert: true });
            }
            console.log("Producto agregado al carrito!");
            return true;
        } catch (error) {
            console.log("No existe ningún producto con ese Id!");
            return false;
        }
    }

    async updateQuantity(cid, pid, quantity) {
        try {
            await cartModel.updateOne({ _id: cid, products: { $elemMatch: { product: pid } } }, { $set: { "products.$.quantity": quantity } });
            console.log("Producto actualizado correctamente!");
            return true;
        } catch (error) {
            console.log("No existe ningún producto con ese Id!");
            return false;
        }
    }

    async updateProducts(cid, products) {
        try {
            await cartModel.updateOne({ _id: cid }, { products: products }, { new: true, upsert: true });
            console.log("Producto actualizado correctamente!");
            return true;
        } catch (error) {
            console.log("No existe ningún producto con ese Id!");
            return false;
        }
    }

    async deleteProductCart(cid, pid) {
        try {
            await cartModel.updateOne({ _id: cid }, { $pull: { products: { product: pid } } });
            console.log("Producto eliminado correctamente!");
            return true;
        } catch (error) {
            console.log("No existe ningún producto con ese Id!");
            return false;
        }
    }

    async deleteProductsCart(cid) {
        try {
            await cartModel.updateOne({ _id: cid }, { products: [] });
            console.log("Productos aliminados correctamente!");
            return true;
        } catch (error) {
            console.log("No existe ningún producto con ese Id!");
            return false;
        }
    }
}

export default cartManager;