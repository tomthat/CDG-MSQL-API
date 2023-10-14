const express = require('express')
const app = express()
const port = 3000
const mysql2 = require('mysql2');
const bcrypt = require('bcrypt');
const saltRounds = 10;


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const conn = mysql2.createConnection({
    host: '139.59.114.197',
    user: 'root',
    password: 'Tom!@#$123',
    database: 'tomdb'
  });

  if(conn) {
    console.log('Can not connect database');
  }else{ 
    console.log('Connected to database');
}

app.get('/users', async (req, res) => {
    // res.json(req.body.username);
    let sql = "select * from t_user"
    await conn.execute(sql,
        (err,result) => {
            if(err){
            res.status(500).json({
        message : err.message
            })
            return
        }
        res.status(200).json({
            message : "called data successfully" ,
            data : result
        })
        })
})

app.post('/users',async (req, res) => {

    const {email,phone,gens,first_name,last_name,nick_name,address,brith_date,user_status,password} = req.body
    let role = 'member'
    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            let sql = "insert into t_user (email, phone, gens,first_name,last_name,nick_name,address,brith_date,user_status, password, role,register_date,last_active) values (?,?,?,UPPER(?),UPPER(?),UPPER(?),?,?,?,?,?,SYSDATE(), SYSDATE())"
            conn.execute(sql,
                [email,phone,gens,first_name,last_name,nick_name,address,brith_date,user_status, hash, role],
                (err, result) => {
                    if(err){
                        res.status(500).json({
                            message : err.message
                        })
                        return
                    }
                    res.status(201).json({
                        message : "Add data successfully",
                        data : result
                })
        })
    })
    });
});


app.get('/users/:id', async (req,res) => {
    const { id } = req.params
    let sql = "select * from t_user where id = ?"
    conn.execute(sql,
        [ id ],
        (err, result) => {
            if(err){
                res.status(500).json({
                    message : err.message
                })
                return
            }
            res.status(200).json({
                message : "called data successfully" ,
                data : result
            })
        })
})

app.put('/users/:id', async (req,res) => {
    const { id } = req.params
    const {phone, password,gens,first_name,last_name,nick_name,email,address,brith_date,user_status} = req.body
    bcrypt.genSalt(saltRounds,(err,salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            let sql = "update t_user set phone =? , password =? , gens = ?, first_name= UPPER(?), last_name= UPPER(?),nick_name=UPPER(?),email =?,address=?,brith_date=?,user_status=? ,last_active = SYSDATE() where user_id =?"
            conn.execute(sql,
                [phone, hash,gens,first_name,last_name,nick_name,email,address,brith_date,user_status, id],
                (err, result) => {
                    if(err){
                    res.status(500).json({
                        message : err.message
                    })
                    return
                }
                res.status(200).json({
                    message : "Update Success",
                    data : result
                })
            })
        })
    })
})

app.delete('/users/:id', async (req, res) => {
    const { id } = req.params
    let sql = "delete from t_user where user_id = ?"

    conn.execute(sql,
        [ id ],
        (err, result) => {
            if(err){
                res.status(500).json({
                    message : err.message
                })
                return
            }res.status(200).json({
                message : "Delete Success",
                data : result
            })
        })
})

app.listen(port, () => {
console.log(`Example app listening on port ${port}`)
})