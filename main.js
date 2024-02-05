const express = require('express');
const app= express();
const db = require('./DB_Connection/connection');
const bodyParser = require('body-parser');

require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',(req,resp)=>{
    // resp.sendFile(__dirname+'/registration.html');
    resp.sendFile(__dirname+'/reg2.html');
});

app.post('/', (req, resp) => {
    const name_get = req.body.name;
    console.log(name_get)
    const email_get = req.body.email;
    const phone_get = req.body.phone;
    const password_get = req.body.password;
    const Address_get = req.body.address;
    const ABN_Number_get = req.body.abn;
    // Check if name is provided and not empty
    if (!name_get || name_get.trim() === '') {
        return resp.status(400).send('Name cannot be empty.');
    }else{

 
    db.getConnection()
        .then((connection) => {
          
            console.log('Connected to the database');
            const sql = "INSERT INTO register_data (name, email, phone, password, address, abn_no) VALUES (?, ?, ?, ?, ?, ?)";
            
            return connection.query(sql, [name_get, email_get, phone_get, password_get, Address_get, ABN_Number_get])
                .then((result) => {
                    console.log('Query executed successfully');
                    resp.send('Registration Successful');
                })
                .catch((err) => {
                    console.log('Error executing query:', err);
                    resp.status(500).send(err.message || 'Internal Server Error');
                })
                .finally(() => {
                    // Release the connection back to the pool
                    connection.release();
                    console.log('Connection released');
                });
        })
        .catch((err) => {
            console.log('Error connecting to the database:', err);
            resp.status(500).send(err.message || 'Internal Server Error');
        });
    }
});
   

db.query("SELECT 1")
    .then(()=>{
        app.listen(3000, () => {
            console.log(`Server is running`);
          });        
    })  
    .catch(err => console.log("connection failed \n"+ err));

