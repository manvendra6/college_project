 
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config(
   {
    path:'./src/.env'
   }
)

 
    const connectDB = async ()=>{
      try {
        const Connection= await mongoose.connect(process.env.MONGO_URL,{
          dbName:process.env.MONGO_NAME,
          
        });
        console.log( `db connection ${Connection.connection.host}`)
    

      } catch (error) {
         console.log("Error in DB connection",error)
      }

    } 

  
export default  connectDB