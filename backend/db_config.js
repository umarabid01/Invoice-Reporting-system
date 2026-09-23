import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing from backend/.env");
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.query("SELECT 1")
.then(()=>{
    console.log("DB Connected");
    
})
.catch(()=>{
    console.log("DB not Connected");
})


export default pool;