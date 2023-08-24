import { cartModel } from "./models/cart.model.js";

class cartManager {

    async newCart() {
        await cartModel.create({ products: [] });
        console.log("Carrito creado correctamente!");
        return true;
    }

    async getCart(id) {
        if (this.validateId(id)) {
            return await cartModel.findOne({ _id: id }).lean() || null;
        } else {
            console.log("No se encontró nigún carrito con este Id!");
            return null;
        }
    }

    async getCarts() {
        return await cartModel.find().lean();
    }

    async addToCart(cid, pid) {
        try {
            if (this.validateId(cid)) {
                const cart = await this.getCart(cid);
                const product = cart.products.find(item => item.product === pid);
                if (product) {
                    product.quantity += 1;
                } else {
                    cart.products.push({ product: pid, quantity: 1 });
                }
                await cartModel.updateOne({ _id: cid }, { products: cart.products });
                console.log("Producto agregado al carrito!");
                return true;
            } else {
                console.log("No se pudo agregar al carrito!");
                return false;
            }
        } catch (error) {
            console.log("Ha ocurrido un error al agregar el producto!");
            return false;
        }
    }

    validateId(id) {
        return id.length === 24 ? true : false;
    }
}

export default cartManager;