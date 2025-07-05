import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    });
}

export async function verifyFirebaseToken(authHeader: string | null) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Unauthorized');
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
        const decoded = await admin.auth().verifyIdToken(idToken);
        return decoded; // berisi uid, email, dll.
    } catch (err) {
        throw new Error('Invalid Token');
    }
}
