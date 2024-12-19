import app from "./src/app.js";
import { connectDB } from "./src/db.js"

connectDB()
app.listen(5000)
console.log('server on port runing', 5000)