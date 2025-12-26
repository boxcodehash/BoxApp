const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.sendMessage = functions.https.onCall(async (data, ctx)=>{
  if(!ctx.auth) throw new functions.https.HttpsError("unauthenticated");

  const {channelId, content, username} = data;
  const uid = ctx.auth.uid;

  const url=/https?:\/\/|www\.|\.[a-z]{2,}/i;
  if(url.test(content)) throw new functions.https.HttpsError("permission-denied");

  const now=Date.now();
  const last=admin.database().ref(`lastMessage/${uid}`);
  const snap=await last.get();
  if(snap.exists() && now-snap.val()<2000)
    throw new functions.https.HttpsError("resource-exhausted");

  await last.set(now);

  await admin.database().ref(`messages/${channelId}`).push({
    content, userId:uid, username,
    timestamp:admin.database.ServerValue.TIMESTAMP
  });

  return {ok:true};
});
