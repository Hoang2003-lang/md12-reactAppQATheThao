import { FacebookAuthProvider, getAuth, signInWithCredential } from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

export async function onFacebookButtonPress() {
  
  //Khi người dùng nhấn nút Facebook, gọi LoginManager.logInWithPermissions() để yêu cầu quyền truy cập
  const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

  //Nếu người dùng hủy đăng nhập, hàm sẽ ném lỗi và không tiếp tục
  if (result.isCancelled) {
    throw 'User cancelled the login process';
  }

  //Lấy AccessToken của Facebook hiện tại
  const data = await AccessToken.getCurrentAccessToken();

  //Nếu không lấy được token (ví dụ lỗi mạng, lỗi SDK), ném lỗi
  if (!data) {
    throw 'Something went wrong obtaining access token';
  }

  //Dùng token Facebook tạo credential của Firebase
  // Credential này là “chứng chỉ” để Firebase biết người dùng đã đăng nhập bằng Facebook
  const facebookCredential = FacebookAuthProvider.credential(data.accessToken);

  //Trả về Promise của user Firebase, bao gồm thông tin uid, email, name, v.v
  return signInWithCredential(getAuth(), facebookCredential);
}