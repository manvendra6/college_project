 
import { app } from "./App.js";
 
import connectDB from "./src/DB/Database.js";

 
const port = process.env.PORT||8000;
connectDB()
.then(()=>{
  try {
        app.listen(port,()=>{
        console.log(`Server is running on port ${port}`);
    })
  } catch (error) {
    console.log( `server is not listen on port ${port}`);
  }

})
 