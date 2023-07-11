const { query } = require("express");
const express = require("express");
const jwt = require('jsonwebtoken')
const connection = require('./db.config.js');
const controller = require('./models/controller.js');
const middleware = require('./middleware/geretoken.js')
const cors = require("cors");


const app = express();
app.use(express.json());
app.use(cors());
const SECRET = 'mykey'



// Formulaire de connexion 
app.post('/login', controller.generate_token);
    

// recuperation des users
app.get('/users', controller.users);

// récupération des infos de l'utulisateur
app.get('/user/:id',controller.recup_user);

//récupération du user actuel connecté
app.get('/me', middleware.checkTokenMiddleware, (req, res) => {
        // Récupération du token
            const token = req.headers.authorization && middleware.extractBearerToken(req.headers.authorization)
        // Décodage du token
            const decoded = jwt.decode(token, { complete: false })
     
    return res.json({ content: decoded })
});

// création d'un user
app.post('/register', controller.create_user);
//modification du user
app.put('/user/:id',middleware.checkTokenMiddleware,controller.update_user);
//suppression du user
app.delete('/user/:id',middleware.checkTokenMiddleware,controller.delete_user);
// création d'un product et association avec l'utulisateur connecté
app.post('/product/create',middleware.checkTokenMiddleware,(req,res,next)=>{  
    const product = req.body;
    connection.query("insert into Products (name,price,UserID) values(?,?,?)", [product.name, product.price, product.id ], (err, results,)=> {
        if(!err) {
            return res.status(200).json({message: "successfully"})
        }
        else  
         return res.status(500).json
        });
    });
// récupération des infos d'un produit
app.get('/product/:id',middleware.checkTokenMiddleware,controller.recup_info_product);
// recuperation des products
app.get('/products', middleware.checkTokenMiddleware,controller.recup_Allproducts);
//suppression du product
app.delete('/product/:id',middleware.checkTokenMiddleware,controller.delete_products);
//modifier un product
app.put('/product/:id',middleware.checkTokenMiddleware,controller.update_product);
// récupère tous les produits existants concernant un utilisateur
app.get('/products/:id',middleware.checkTokenMiddleware,controller.user_product);

app.listen(5000);