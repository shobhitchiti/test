const express = require('express');
const app = express();
const db = require('./DB_Connection/connection');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, resp) => {
    resp.sendFile(__dirname + '/reg2.html');
});

app.post('/', async (req, resp) => {
    const fname_get = req.body.fname;
    const lname_get = req.body.lname;
    const email_get = req.body.email;
    const phone_get = req.body.phone;
    const password_get = req.body.password;
    const Address_get = req.body.address;
    const ABN_Number_get = req.body.abn;

    if (!fname_get || phone_get.length < 10) {
        return resp.status(400).send('Please enter valid fname and phone (at least 10 digits).');
    }else {
        try {
            try {
                const hashedPassword = await bcrypt.hash(password_get, 10); // Hash the password with bcrypt
                const connection = await db.getConnection();
                console.log('Connected to the database');
                const sql = "INSERT INTO register_data (fname, lname, email, phone, password, address, abn_no, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)";
                const result = await connection.query(sql, [fname_get, lname_get, email_get, phone_get, hashedPassword, Address_get, ABN_Number_get]);        
                console.log('Query executed successfully');
                resp.send('Registration Successful');
                connection.release();
                console.log('Connection released');
            } catch (error) {
                console.log('Error executing query:', error);
                resp.status(500).send(error.message || 'Internal Server Error');
            }
            
        } catch (error) {
            console.log('Error executing query:', error);
            resp.status(500).send(error.message || 'Internal Server Error');
        }
    }
});

db.getConnection()
    .then((connection) => {
        connection.query("SELECT 1")
            .then(() => {
                app.listen(3000, () => {
                    console.log(`Server is running`);
                });
            })
            .catch(err => {
                console.log("Connection failed \n" + err);
                process.exit(1);
            })
            .finally(() => {
                connection.release();
            });
    })
    .catch(err => console.log("connection failed \n" + err));
