import admin from "firebase-admin";

// Uses a Firebase service account (downloaded from Firebase Console ->
// Project Settings -> Service Accounts -> Generate New Private Key).
// Store the JSON contents (stringified) in FIREBASE_SERVICE_ACCOUNT env var.
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT || "{}",
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;