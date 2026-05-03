const app = require("./app");
const connectDb = require("./config/database");

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        console.log("Starting dependencies...");

        await connectDb();
        console.log("Database connected");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error("Startup failed:", err.message);
        process.exit(1);
    }
}

startServer();