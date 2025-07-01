import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth"

export const _signInWithGoogle= async () => {
    try {
        GoogleSignin.configure({
            offlineAccess: false,
            webClientId: "985098184266-s3mp7f1q7t899ef5g3eu2huh3ocarusj.apps.googleusercontent.com",
            scopes: ["profile", "email"]
        });
        await GoogleSignin.hasPlayServices();
        await GoogleSignin.signOut(); 
        const userInfo= await GoogleSignin.signIn();

        const {idToken}= await GoogleSignin.signIn();
        const googleCredentials= auth.GoogleAuthProvider.credential(idToken);
        auth().signInWithCredential(googleCredentials);
        return userInfo;
        
    } catch (error) {
        console.log("==> Google Sign In", error);
        return null;
        
    }
}