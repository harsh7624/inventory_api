const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');

const {pool,Client} = require('pg');
const connectionString = 'postgressql://postgres:123@localhost:5432/company'




const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '123',
      database : 'company'
    }
  });


const app = express();
app.use(bodyParser.json());
app.use(cors());


app.get('/test',(req,res) => {
    
    const client = new Client({
        connectionString: connectionString
    })
    client.connect()
    client.query('select * from product ',(err,rows) =>{
       // console.log(err,rows)
        if(err){
            console.log(err);
        }else{
            console.log('triallllllllllllll')
            console.log(rows);
            res.json(rows);
           //return(rows.json)
            
        }
      //  client.end()
    })
})

app.post('/signin' , (req,res) => {
    db.select('email','password').from('login')
    .where('email' ,'=' , req.body.email)
    .then(data => {
        if(req.body.password === data[0].password){
            return db.select('*').from('login')
            .where('email', '=',req.body.email)
            .then(user => {
                
                res.json(user[0])
            })
            .catch(err => res.status(400).json('unable to get user'))
        } else{
            res.status(400).json('wrong credentials');
        }
    })
    .catch(err => res.status(400).json('wrong credentials'))
})


app.post('/checkRole' , (req,res) => {
    db.select('role').from('role')
    .where('email' ,'=' , req.body.email)
    .then(data => {
        console.log('server Check ROLE');
       res.json(data[0].role);
    })
    .catch(err => res.status(400).json('wrong credentials'))
})

/*app.post('/addAssistant',(req,role) => {
    const client = new Client({
        connectionString: connectionString
    })
    client.connect();
    console.log(req.body.pid);
    client.query('insert into order (pid,quantity_ordered) values ($1,$2)  ',[req.body.pid,req.body.quantity], (err,row) => {
        if(err){
            console.log(err)
        }
})*/

app.post('/addAssistant',(req,role) => {
    const client = new Client({
        connectionString: connectionString
    })
    client.connect();
    console.log(req.body.pid);
    client.query('Insert into order (oid,pid, quantity_ordered) values($1, $2)',
    [req.body.pid, req.body.quantity],(err,row) => {
        if(err){
            console.log('failure');
            console.log(err)
        }
        else{
            console.log('success');
        }
    })

})
   







app.put('/updatequantity', (req,res) => {
    //do updateInventory
    

    const client = new Client({
        connectionString: connectionString
    })
    client.connect();
    console.log(req.body.pid);
    client.query('select quantity from product where pid = ($1)',[req.body.pid], (err,row) => {
        if(err){

        }else{

            let value = row.rows[0].quantity;
            console.log(row.rows[0].quantity,'afds');
            value = value + parseInt(req.body.quantity);


            client.query('update product set quantity = ($1) where pid = ($2) ' ,[value,req.body.pid],function(err,rows)  {
                // console.log(err,rows)
                 if(err){
                     console.log(err);
                 }else{
                     console.log('trialllllllll')
                     console.log(rows);
                     res.json(rows);
                    //return(rows.json)
                     
                 }
               //  client.end()
             })
        }
    })
    
    
})

app.listen(3000, () => {
    console.log('app is running on port ');
})