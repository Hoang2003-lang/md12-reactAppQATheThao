import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { getAuth, GoogleAuthProvider, signInWithCredential } from "@react-native-firebase/auth";

//Thất bại
export const _signInWithGoogle = async () => {
  try {
    // 1. Cấu hình Google Sign-In
    GoogleSignin.configure({
      offlineAccess: true,
      webClientId: "985098184266-s3mp7f1q7t899ef5g3eu2huh3ocarusj.apps.googleusercontent.com",
      scopes: ["profile", "email"],
    });

    // 2. Kiểm tra Google Play Services
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    // 3. Đăng xuất để tránh cache cũ
    await GoogleSignin.signOut();

    // 4. Đăng nhập và lấy idToken
    const userInfo = await GoogleSignin.signIn();
    const tokens = await GoogleSignin.getTokens();
    const idToken = tokens.idToken;         
    const accessToken = tokens.accessToken;

    // console.log("==> Google tokens:");
    // console.log("idToken:", idToken);
    // console.log("accessToken:", accessToken);

    if (!idToken) {
      throw new Error("Không thể lấy idToken từ Google");
    }

    // 5. Tạo credential và đăng nhập Firebase
    const authInstance = getAuth();
    const credential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(authInstance, credential);

    console.log("Firebase login by Google success:", userCredential.user.email);


    // 6. Trả về thông tin người dùng
    return {
      id: userCredential.user.uid,
      email: userCredential.user.email,
      name: userCredential.user.displayName,
      photo: userCredential.user.photoURL,
      idToken,
      accessToken,  // Google accessToken dùng để gọi Google API
    };

  } catch (error) {
    console.log("==> Google Sign In Error:", error);
    return null;
  }
};