import {Pool} from 'pg'

const pool =new Pool({
    host:"localhost",
    port:5432,
    user:"postgres",
    password:"1234",
    database:"Management_DB"
})

pool.connect()
.then(()=>{
    console.log("DB Connected")
    
})
.catch(()=>{
    console.log("DB not Connected")
})


export default pool;