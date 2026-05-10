import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { AppDataSource } from "./config/data-source";
import userRoutes from "./routes/user.routes";
import vacationRequestRoutes from "./routes/vacationRequest.routes";

const app = express();
dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

// app.use("/api/v1", (req: Request, res: Response) => {
//   res.json({ message: "Hello World" });
// });

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/requests", vacationRequestRoutes);

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error: unknown) => {
    console.error("Failed to initialize database connection", error);
    process.exit(1);
  });

export default app;
