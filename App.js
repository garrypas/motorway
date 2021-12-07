const express = require('express');
const CarPrices = require("./CarPrices");
const carPrices = new CarPrices();

const PORT = process.env.APP_PORT || 8080;
module.exports = (port = PORT) => {
    const app = express();
    app.get('/price', async (req, res) => {
        const numberPlate = req.query.numberPlate;
        if (!numberPlate) {
            return res.status(400).send({
                description: "Number plate missing or invalid"
            });
        }
        try {
            const price = await carPrices.getPrice(numberPlate, false);
            res.send({
                price
            });
        } catch (err) {
            res.status(500).send({
                description: "An internal error occurred"
            });
        }
    });
    const server = app.listen(port, () => {
        console.log(`Motorway app listening at http://localhost:${port}`)
    });
    return {
        app,
        server
    };
};