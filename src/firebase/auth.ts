import * as admin from 'firebase-admin';
import serviceAccount from './config.json'

export async function verifyFirebaseToken(authHeader: string | null) {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as any)
        });
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Unauthorized');
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
        const decoded = await admin.auth().verifyIdToken(idToken);
        return decoded;
    } catch (err) {
        console.log(err);
        throw new Error('Invalid Token');
    }
}
