import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config"; // Ensure correct path

export async function signIn(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw new Error(error.message);
    }
}
