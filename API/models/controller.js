const { query } = require("express");
const express = require("express");
const jwt = require('jsonwebtoken')
const connection = require('../db.config.js');
const middleware = require('../middleware/geretoken.js')
const cors= require("cors")
const app = express();
app.use(express.json());
app.use(cors());
const SECRET = 'mykey'  


exports.users = function(req, res) {
    connection.query('SELECT * FROM Users', (error, result) => {
        if (error) {
            return res.send('erreur lors de la recherche des users ')
        } else {
            console.log(result)
            return res.send(result)
        }
    })
}

const login =  function(username,password) {
   var idUser = []
   return new Promise ((resolve, reject)=> {
   connection.query('SELECT * FROM Users where username = ? AND password = ?', [username,password], function (err,result) {
    if(err) {
        reject(err);    
    }
    else {
        for(var k of Object.keys(result)) {
           if(result[k].username === username && result[k].password === password) {
            idUser.push({id:result[k].id, "username" : result[k].username, "email": result[k].email, "password": result[k].password})
            console.log('success connection');
           } else {
            console.log('connection failed');
            resolve(-1);
           }
        };
        resolve(idUser);
    }
   });
   });
}
exports.generate_token = (async(req,res)=> {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message: 'Error. Please enter the correct username and password' })
    }

// Checking
    const users = await login(req.body.username,req.body.password);
    const user =  users.find(u => u.username === req.body.username && u.password === req.body.password)

    // Pas bon
    if (!user) {
        return res.status(400).json({ message: 'Error. Wrong login or password' })
    }

    const token = jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
    }, SECRET, { expiresIn: '3 hours' })

return res.json({ access_token: token })
});
exports.recup_user = (req,res)=>{  
    connection.query('SELECT * FROM Users WHERE id = ?',[req.params.id],(err,rows,fields)=>{  
    if(!err)   
     return res.send(rows);  
    else  
        console.log(err);  
      
})  
}
exports.create_user = (req,res,next)=>{  
    const user = req.body;
    connection.query("insert into Users (username,password,role,email,adresse) values(?,?,?,?,?)", [user.username, user.password, user.role, user.email, user.adresse ], 
        (err, results,)=> {
        if(!err) {
            return res.status(200).json({message: "successfully"})
        }
        else  
         return res.status(500).json({message : 'Not register'})
        });
    }
exports.update_user = function (req, res) {
    const id = req.params.id;
    const user = req.body;
    connection.query("update Users set username=? ,password=? ,role=? ,email=? ,adresse=?  where id =?", [user.username, user.password, user.role, user.email, user.adresse,id ], (err, results,)=> {
    if(!err) {
        if(results.affectRows==0){
            return res.status(400).json({ message:"user not found"});
        }
        return res.status(400).json({message:"user updated successfully"});
    }
    else {
        return res.status(500).json(err);
    }
    });
}
exports.delete_user = (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM Users WHERE id =' + id, (error, result) => {
        if (error) throw error;
        res.status(201).json({message : result});
    });
}
exports.recup_Allproducts = (req, res) => {
    connection.query('SELECT * FROM Products', (error, result) => {
        if (error) {
            res.send('erreur lors de la recherche des users ')
        } else {
            res.send(result)
        }
    })
}
exports.delete_products =  (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM Products WHERE id = ? ', id, (error, result) => {
        if (error) throw error;
        res.status(201).json({message : result});
    });
};
exports.update_product =  (req, res) => {
    const id = req.params.id;
    const product = req.body;
    connection.query("update Products set name=? ,price=? ,UserID=?  where id =?", [product.name, product.price, product.UserID, id ], (err, results,)=> {
    if(!err) {
        if(results.affectRows==0){
            return res.status(400).json({ message:"product not found"});
        }
        return res.status(400).json({message:"product updated successfully"});
    }
    else {
        return res.status(500).json(err);
    }
    });
};
exports.user_product =  (req, res) => {
    connection.query('SELECT * FROM Products Where UserID = ? ', (error, result) => {
        if (error) {
            res.send('erreur lors de la recherche des users ')
        } else {
            res.send(result)
        }
    })
}
exports.recup_info_product = (req,res)=>{  
    connection.query('SELECT * FROM Products WHERE id = ?',[req.params.id],(err,rows,fields)=>{  
    if(!err)   
    res.send(rows);  
    else  
        console.log(err);  
      
})  
}
