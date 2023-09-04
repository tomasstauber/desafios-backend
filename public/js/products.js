const crearCarrito = async () => {
    try {
        if (localStorage.getItem("carrito")) {
            return await JSON.parse(localStorage.getItem("carrito"));
        } else {
            const response = await fetch("/api/carts/", {
                method: "POST",
                headers: {"Content-type": "application/json; charset=UTF-8"}
            });
            const data = await response.json();
            localStorage.setItem("carrito", JSON.stringify(data));
    
            return data;
        }
    } catch(error) {
        console.log("Ha ocurrido un error al crear el carrito! " + error);
    }
}

const obtenerIdCarrito = async () => {
    try {
        let cart = await crearCarrito();
    
        return cart.id;
    } catch(error) {
        console.log("Error! No existe ningún carrito con ese ID! " + error);
    }
}

const agregarProductoAlCarrito = async (pid) => {
    try {
        let cid = await obtenerIdCarrito();
    
        await fetch("/api/carts/" + cid + "/products/" + pid, {
            method: "POST",
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json())
        .then(data => {
            console.log("Producto agregado al carrito!");
        });
    } catch(error) {
        console.log("Error! Ha ocurrido un error al agregar el producto! " + error);
    }
}