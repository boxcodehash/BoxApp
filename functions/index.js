const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.sendMessage = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated");
  }

  const uid = context.auth.uid;
  const { channelId, content, username } = data;

  if (!content || typeof content !== "string") {
    throw new functions.https.HttpsError("invalid-argument");
  }

  // 🚫 BLOQUEO DE URL
  const urlRegex = /(https?:\/\/|www\.|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})/i;
  if (urlRegex.test(content)) {
    throw new functions.https.HttpsError("permission-denied", "Links not allowed");
  }

  const now = Date.now();
  const lastRef = admin.database().ref(`lastMessage/${uid}`);
  const snap = await lastRef.get();

  if (snap.exists() && now - snap.val() < 2000) {
    throw new functions.https.HttpsError(
      "resource-exhausted",
      "Wait 2 seconds"
    );
  }

  await lastRef.set(now);

  await admin.database().ref(`messages/${channelId}`).push({
    content,
    userId: uid,
    username,
    timestamp: admin.database.ServerValue.TIMESTAMP
  });

  return { ok: true };
});
