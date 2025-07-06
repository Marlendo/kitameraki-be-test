import * as admin from 'firebase-admin';

const serviceAccountDefault = {
    type: '',
    project_id: '',
    private_key_id: '',
    private_key: '',
    client_email: '',
    client_id: '',
    auth_uri: '',
    token_uri: '',
    auth_provider_x509_cert_url: '',
    client_x509_cert_url: '',
    universe_domain: '',
}

function getServiceAccount() {
    try {
        const encoded = process.env.FIREBASE_SERVICE_ACCOUNT!;
        const serviceAccount = JSON.parse(Buffer.from(encoded, 'base64').toString('utf8'));
        return serviceAccount;
    } catch (error) {
        console.log(error);
        return serviceAccountDefault
    }
}

export async function verifyFirebaseToken(authHeader: string | null) {
    if (!admin.apps.length) {
        const serviceAccount = getServiceAccount();
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
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
