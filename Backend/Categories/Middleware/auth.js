// auth.js
import admin from "firebase-admin";
import dotenv from "dotenv";
import path from "path";


// Load env file correctly
dotenv.config({ path: path.resolve("..", "config.env") });

// Fix for private key parsing
const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

// Firebase service account credentials from env
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: privateKey,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT,
};

// Verify all required fields are present before initializing
const validateServiceAccount = () => {
  const requiredFields = ['project_id', 'private_key', 'client_email'];
  const missingFields = requiredFields.filter(field => !serviceAccount[field]);
  
  if (missingFields.length > 0) {
    console.error(`Missing required service account fields: ${missingFields.join(', ')}`);
    return false;
  }
  
  return true;
};

// Initialize Firebase Admin only once
if (!admin.apps.length) {
  try {
    if (validateServiceAccount()) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("Firebase Admin initialized successfully");
    } else {
      console.error("Firebase Admin initialization skipped due to missing credentials");
    }
  } catch (error) {
    console.error("Firebase Admin initialization error:", error.message);
  }
}

// Middleware to check Firebase token
export const checkAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth Error:", err.message);
    return res.status(403).json({ message: "Unauthorized" });
  }
};