import { app } from "./src/app.js";
import dotenv from "dotenv";
import { connect } from "./src/config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed", err);
    process.exit(1);
  });
