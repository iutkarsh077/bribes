import mongoose from "mongoose";
import dns from "node:dns";

let isConnected = false;

const configureDns = () => {
  const configuredServers = process.env.MONGODB_DNS_SERVERS
    ?.split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  if (configuredServers?.length) {
    dns.setServers(configuredServers);
  }
};

const DbConnect = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return mongoose;
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error("MONGODB_URI is missing");
    }

    configureDns();
    await mongoose.connect(uri);

    isConnected = true;

    console.log("MongoDB connected successfully");
    return mongoose;
  } catch (error: any) {
    console.error("failed to connect to db", error.message);
    throw error;
  }
};

export const connectToDatabase = DbConnect;

export function isMongoConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export default DbConnect;
