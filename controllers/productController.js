let products = [];
let nextId = 1;

exports.getAllProducts = (req, res) => {
    let filtered = [...products];
    const { search, minPrice, maxPrice, page = 1, limit = 5 } = req.query;

    if (search) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (minPrice) filtered = filtered.filter(p => p.price >= Number(minPrice));
    if (maxPrice) filtered = filtered.filter(p => p.price <= Number(maxPrice));

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + Number(limit));

    res.json({ results: paginated, total: filtered.length });
};

exports.getProductById = (req, res) => {
    const product = products.find(p => p.id === Number(req.params.id));
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
};

exports.createProduct = (req, res) => {
    const { name, price } = req.body;
    const newProduct = { id: nextId++, name, price };
    products.push(newProduct);
    res.status(201).json(newProduct);
};

exports.updateProduct = (req, res) => {
    const product = products.find(p => p.id === Number(req.params.id));
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.name = req.body.name;
    product.price = req.body.price;
    res.json(product);
};

exports.deleteProduct = (req, res) => {
    const index = products.findIndex(p => p.id === Number(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Product not found' });

    products.splice(index, 1);
    res.status(204).send();
};
