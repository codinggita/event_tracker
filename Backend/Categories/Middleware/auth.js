import admin from "firebase-admin";
import serviceAccount from "../data/firebaseServiceAccountKey.json" assert { type: "json" };

// ✅ Firebase Admin SDK Initialize
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const checkAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  
  // console.log("📢 Received Token from Frontend:", token); // ✅ Debugging

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    // console.log("✅ Decoded Token:", decodedToken); // ✅ Debugging
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("❌ Authentication Error:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

