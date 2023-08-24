import { productModel } from "./models/product.model.js";

class ProductManager {

    async addProduct(product) {
        try {
            if (await this.validateCode(product.code)) {
                console.log("Error! Ya existe un producto con este código!");
                return false
            } else {
                await productModel.create(product);
                console.log("Producto agregado correctamente!");
                return true;
            }
        } catch (error) {
            console.log("Se ha producido un error al agregar el producto!");
            return false;
        }
    }

    async updateProduct(id, product) {
        try {
            if (this.validateId(id)) {
                if (await this.getProductById(id)) {
                    await productModel.updateOne({ _id: id }, product);
                    console.log("Producto actualizado correctamente!");
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.log("Se ha producido un error al actualizar el producto!");
            return false;
        }
    }

    async deleteProduct(id) {
        try {
            if (this.validateId(id)) {    
                if (await this.getProductById(id)) {
                    await productModel.deleteOne({_id:id});
                    console.log("Producto eliminado correctamente!");
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.log("No se encontró ningún producto con este Id!");
            return false;
        }
    }

    async getProducts(limit) {
        return await limit ? productModel.find().limit(limit).lean() : productModel.find().lean();
    }

    async getProductById(id) {
        if (this.validateId(id)) {
            return await productModel.findOne({ _id: id }).lean() || null;
        } else {
            console.log("No se encontró ningún producto con este Id!");
            return null;
        }
    }

    async validateCode(code) {
        return await productModel.findOne({ code: code }) || false;
    }

    validateId(id) {
        return id.length === 24 ? true : false;
    }

}

export default ProductManager;