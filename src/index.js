const app = require('./servidor');
const rotas = require('./rotas')
app.listen(3000);
module.exports = rotas, app;