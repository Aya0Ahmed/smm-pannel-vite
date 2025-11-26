const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

export async function updateServices() {
  const services = await fetch("https://localhost:7220/api/apitest/services")
    .then(res => res.json());

  // حفظ في Firestore مباشرة من frontend
  const batch = db.batch();
  const colRef = db.collection("services");

  services.forEach((srv) => {
    const docRef = colRef.doc(String(srv.service));
    batch.set(docRef, srv, { merge: true });
  });

  await batch.commit();

  console.log("Services updated successfully", services.length);
  return services;
}
