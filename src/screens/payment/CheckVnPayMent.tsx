import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import API from "../../api"; // ✅ Sử dụng API instance cho các endpoint thông thường
import { BASE_URL } from "../../constants"; // ✅ Import BASE_URL từ constants
import axios from "axios"; // ✅ Import axios để gọi endpoint trực tiếp

// ✅ Khai báo global type
declare global {
  var paymentResultParams: any;
}

// ✅ Sử dụng BASE_URL từ constants để đồng nhất
const BACKEND_URL = BASE_URL;

interface PaymentResult {
  status: "success" | "error" | "loading";
  title: string;
  subtitle: string;
  orderCode?: string;
  amount?: number;
  transactionId?: string;
  bankCode?: string;
  paymentTime?: string;
}

const CheckVnPayMent = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [paymentResult, setPaymentResult] = useState<PaymentResult>({
    status: "loading",
    title: "Đang kiểm tra thanh toán...",
    subtitle: "Vui lòng chờ trong giây lát",
  });

  useEffect(() => {
    checkPaymentResult();
  }, []);

  const checkPaymentResult = async () => {
    try {
      // ✅ Lấy query parameters từ route params (deep link hoặc navigation)
      const params = route.params as any;
      let searchParams = params?.searchParams || {};

      // ✅ Nếu không có searchParams, thử lấy từ params trực tiếp
      if (!searchParams || Object.keys(searchParams).length === 0) {
        searchParams = params || {};
      }

      // ✅ Kiểm tra global params từ deep link (nếu có)
      if (global.paymentResultParams && Object.keys(global.paymentResultParams).length > 0) {
        searchParams = global.paymentResultParams;
        // Clear global params sau khi sử dụng
        global.paymentResultParams = null;
      }

      console.log("🔍 VNPay Search Params:", searchParams);
      console.log("🌐 Backend URL:", BACKEND_URL);
      console.log("🔍 Route params:", route.params);
      console.log("🔍 Global payment params:", global.paymentResultParams);

      // ✅ Kiểm tra có params VNPay không
      if (!searchParams.vnp_ResponseCode && !searchParams.error) {
        console.log("Không có VNPay params, hiển thị lỗi");
        console.log("🔍 Available params:", Object.keys(searchParams));
        
        setPaymentResult({
          status: "error",
          title: "Không có thông tin thanh toán",
          subtitle: "Vui lòng thử lại hoặc liên hệ hỗ trợ",
        });
        return;
      }

      // ✅ Xử lý VNPay trực tiếp từ params
      console.log("VNPay Response Code:", searchParams.vnp_ResponseCode);
      
      if (searchParams.vnp_ResponseCode === "00") {
        // ✅ Thanh toán thành công
        const orderCode = searchParams.vnp_OrderInfo?.replace("Thanh_toan_don_hang_", "");
        const amount = searchParams.vnp_Amount ? Number(searchParams.vnp_Amount) / 100 : undefined;
        
        setPaymentResult({
          status: "success",
          title: "Thanh toán thành công",
          subtitle: "Đơn hàng của bạn đã được xử lý thành công",
          orderCode: orderCode,
          amount: amount,
          transactionId: searchParams.vnp_TransactionNo,
          bankCode: searchParams.vnp_BankCode,
          paymentTime: searchParams.vnp_PayDate,
        });
        
        // ✅ Gọi API để cập nhật trạng thái đơn hàng (nếu chưa được cập nhật)
        try {
          if (orderCode) {
            console.log("🔄 Cập nhật trạng thái đơn hàng:", orderCode);
            console.log("🌐 Backend URL cho update:", BACKEND_URL);
            
            // ✅ Sử dụng API.put thay vì gọi trực tiếp
            const updateResponse = await API.put(`/orders/${orderCode}/status`, {
              status: 'paid',
              paymentStatus: 'completed',
              paymentMethod: 'vnpay',
              paymentDetails: {
                transactionId: searchParams.vnp_TransactionNo,
                bankCode: searchParams.vnp_BankCode,
                paymentTime: searchParams.vnp_PayDate,
                amount: amount
              }
            });
            console.log("✅ Cập nhật trạng thái đơn hàng thành công:", updateResponse.data);
          }
        } catch (updateError: any) {
          console.log("⚠️ Không thể cập nhật trạng thái đơn hàng:", {
            message: updateError.message,
            response: updateError.response?.data,
            status: updateError.response?.status,
            config: updateError.config
          });
          // Không hiển thị lỗi cho user vì thanh toán đã thành công
        }
        
      } else if (searchParams.vnp_ResponseCode === "24") {
        // ✅ Khách hàng hủy thanh toán
        setPaymentResult({
          status: "error",
          title: "Khách hàng hủy thanh toán",
          subtitle: "Thanh toán đã bị hủy",
          orderCode: searchParams.vnp_OrderInfo?.replace("Thanh_toan_don_hang_", ""),
        });
      } else if (searchParams.error) {
        // ✅ Xử lý lỗi từ backend
        let errorTitle = "Thanh toán thất bại";
        let errorSubtitle = "Đã xảy ra lỗi trong quá trình thanh toán";
        
        switch (searchParams.error) {
          case 'order_not_found':
            errorTitle = "Không tìm thấy đơn hàng";
            errorSubtitle = "Đơn hàng có thể chưa được tạo hoặc đã bị xóa";
            break;
          case 'update_failed':
            errorTitle = "Lỗi cập nhật đơn hàng";
            errorSubtitle = "Thanh toán thành công nhưng không thể cập nhật trạng thái";
            break;
          case 'invalid_signature':
            errorTitle = "Dữ liệu không hợp lệ";
            errorSubtitle = "Chữ ký thanh toán không đúng";
            break;
          case 'server_error':
            errorTitle = "Lỗi server";
            errorSubtitle = "Máy chủ gặp sự cố, vui lòng thử lại sau";
            break;
          default:
            errorSubtitle = `Mã lỗi: ${searchParams.error}`;
        }
        
        setPaymentResult({
          status: "error",
          title: errorTitle,
          subtitle: errorSubtitle,
          orderCode: searchParams.vnp_OrderInfo?.replace("Thanh_toan_don_hang_", ""),
        });
      } else {
        // ✅ Lỗi khác từ VNPay
        setPaymentResult({
          status: "error",
          title: "Thanh toán thất bại",
          subtitle: `Mã lỗi: ${searchParams.vnp_ResponseCode || "Unknown"}`,
          orderCode: searchParams.vnp_OrderInfo?.replace("Thanh_toan_don_hang_", ""),
        });
      }
      
    } catch (error: any) {
      console.error("❌ Lỗi chi tiết:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      
      // ✅ Hiển thị lỗi chi tiết hơn
      let errorMessage = "Không thể kiểm tra trạng thái thanh toán.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message === "Network Error") {
        errorMessage = `Không thể kết nối đến server (${BACKEND_URL}). Vui lòng kiểm tra:\n\n1. Backend server đã chạy chưa?\n2. IP address có đúng không?\n3. Firewall có chặn không?`;
      }
      
      setPaymentResult({
        status: "error",
        title: "Lỗi kết nối",
        subtitle: errorMessage,
      });
    }
  };

  const handleGoHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" as never }],
    });
  };

  const handleBuyAgain = () => {
    navigation.navigate("Home" as never);
  };

  const handleCheckOrder = () => {
    // ✅ Navigate đến màn hình đơn hàng
    navigation.navigate("OrderTracking" as never);
  };

  const handleRetry = () => {
    setPaymentResult({
      status: "loading",
      title: "Đang kiểm tra thanh toán...",
      subtitle: "Vui lòng chờ trong giây lát",
    });
    checkPaymentResult();
  };

  // ✅ Thêm chức năng debug để kiểm tra đơn hàng
  const handleDebugOrder = async () => {
    try {
      console.log("🔍 Debug: Kiểm tra đơn hàng trong database...");
      
      // Gọi API debug để kiểm tra đơn hàng - Sử dụng axios trực tiếp cho VNPay endpoints
      const debugResponse = await axios.get(`${BASE_URL}/vnpay/debug/orders`);
      console.log("📦 Debug response:", debugResponse.data);
      
      if (debugResponse.data?.success) {
        Alert.alert(
          "Debug Info", 
          `Tìm thấy ${debugResponse.data.total || 0} đơn hàng gần nhất.\n\nChi tiết: ${JSON.stringify(debugResponse.data.orders || debugResponse.data.order, null, 2)}`
        );
      } else {
        Alert.alert("Debug Info", "Không tìm thấy đơn hàng nào");
      }
    } catch (error: any) {
      console.error("❌ Debug error:", error);
      Alert.alert("Debug Error", error.message || "Lỗi khi debug");
    }
  };

  // ✅ Thêm chức năng test tạo đơn hàng
  const handleTestCreateOrder = async () => {
    try {
      console.log("🧪 Test: Tạo đơn hàng test...");
      
      const testPayload = {
        userId: "test_user_id", // Cần thay bằng user ID thật
        items: [
          {
            id_product: "test_product_id",
            name: "Sản phẩm test",
            purchaseQuantity: 1,
            price: 100000
          }
        ],
        shippingFee: 30000,
        paymentMethod: "vnpay",
        shippingAddress: "Địa chỉ test",
        order_code: `TEST-${Date.now()}`
      };
      
      // Sử dụng axios trực tiếp cho VNPay endpoints
      const testResponse = await axios.post(`${BASE_URL}/vnpay/create_order_and_payment`, testPayload);
      console.log("🧪 Test response:", testResponse.data);
      
      Alert.alert(
        "Test Result", 
        testResponse.data?.success 
          ? "Tạo đơn hàng test thành công!" 
          : "Tạo đơn hàng test thất bại"
      );
    } catch (error: any) {
      console.error("❌ Test error:", error);
      Alert.alert("Test Error", error.response?.data?.message || error.message);
    }
  };

  // ✅ Thêm chức năng kiểm tra kết nối backend
  const handleCheckConnection = async () => {
    try {
      console.log("🔍 Kiểm tra kết nối backend...");
      
      // Thử gọi API debug để kiểm tra kết nối - Sử dụng axios trực tiếp cho VNPay endpoints
      const response = await axios.get(`${BASE_URL}/vnpay/debug/orders`);
      console.log("✅ Kết nối thành công:", response.status);
      
      Alert.alert(
        "Connection Test", 
        `✅ Kết nối thành công!\n\nStatus: ${response.status}\nBackend URL: ${BACKEND_URL}`
      );
    } catch (error: any) {
      console.error("❌ Connection error:", error);
      
      let errorMessage = "Không thể kết nối đến backend";
      if (error.response?.status) {
        errorMessage += `\nStatus: ${error.response.status}`;
      }
      if (error.message === "Network Error") {
        errorMessage += "\n\nNguyên nhân có thể:\n1. Backend server chưa chạy\n2. IP address không đúng\n3. Firewall chặn kết nối";
      }
      
      Alert.alert("Connection Error", errorMessage);
    }
  };

  // ✅ Thêm chức năng test endpoint đơn giản
  const handleTestSimpleEndpoint = async () => {
    try {
      console.log("🧪 Test: Kiểm tra endpoint đơn giản...");
      
      // Thử gọi một endpoint đơn giản trước - Sử dụng API instance cho regular endpoints
      const simpleResponse = await API.get(`/orders`);
      console.log("✅ Simple endpoint thành công:", simpleResponse.status);
      
      Alert.alert(
        "Simple Test", 
        `✅ Endpoint đơn giản hoạt động!\n\nStatus: ${simpleResponse.status}\nData length: ${simpleResponse.data?.data?.length || 0}`
      );
    } catch (error: any) {
      console.error("❌ Simple test error:", error);
      
      let errorMessage = "Endpoint đơn giản không hoạt động";
      if (error.response?.status) {
        errorMessage += `\nStatus: ${error.response.status}`;
      }
      if (error.response?.data?.message) {
        errorMessage += `\nMessage: ${error.response.data.message}`;
      }
      
      Alert.alert("Simple Test Error", errorMessage);
    }
  };

  // ✅ Thêm chức năng test endpoint trực tiếp
  const handleTestDirectEndpoint = async () => {
    try {
      console.log("🧪 Test: Gọi endpoint trực tiếp bằng axios...");
      
      // Test endpoint trực tiếp không qua API instance
      const directResponse = await axios.get(`${BACKEND_URL}/vnpay/debug/orders`);
      console.log("✅ Direct endpoint thành công:", directResponse.status);
      console.log("📦 Direct response data:", directResponse.data);
      
      Alert.alert(
        "Direct Test", 
        `✅ Endpoint trực tiếp hoạt động!\n\nStatus: ${directResponse.status}\nURL: ${BACKEND_URL}/vnpay/debug/orders\n\nData: ${JSON.stringify(directResponse.data, null, 2)}`
      );
    } catch (error: any) {
      console.error("❌ Direct test error:", error);
      
      let errorMessage = "Endpoint trực tiếp không hoạt động";
      if (error.response?.status) {
        errorMessage += `\nStatus: ${error.response.status}`;
      }
      if (error.response?.data) {
        errorMessage += `\nResponse: ${JSON.stringify(error.response.data, null, 2)}`;
      }
      if (error.message) {
        errorMessage += `\nMessage: ${error.message}`;
      }
      
      Alert.alert("Direct Test Error", errorMessage);
    }
  };

  if (paymentResult.status === "loading") {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1677ff" />
        <Text style={styles.loadingText}>{paymentResult.title}</Text>
        <Text style={styles.loadingSubtext}>{paymentResult.subtitle}</Text>
        <View style={styles.loadingDots}>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.dot}>•</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* ✅ Icon Status */}
        <View style={[
          styles.iconContainer,
          paymentResult.status === "success" ? styles.successIcon : styles.errorIcon
        ]}>
          <Text style={styles.iconText}>
            {paymentResult.status === "success" ? "✓" : "✗"}
          </Text>
        </View>

        {/* ✅ Title */}
        <Text style={[
          styles.title,
          paymentResult.status === "success" ? styles.successTitle : styles.errorTitle
        ]}>
          {paymentResult.title}
        </Text>

        {/* ✅ Subtitle */}
        <Text style={styles.subtitle}>{paymentResult.subtitle}</Text>

        {/* ✅ Order Details */}
        {paymentResult.orderCode && (
          <View style={styles.orderDetails}>
            <Text style={styles.orderLabel}>Mã đơn hàng:</Text>
            <Text style={styles.orderCode}>{paymentResult.orderCode}</Text>
          </View>
        )}

        {paymentResult.amount && (
          <View style={styles.orderDetails}>
            <Text style={styles.orderLabel}>Số tiền:</Text>
            <Text style={styles.orderCode}>
              {paymentResult.amount.toLocaleString("vi-VN")}₫
            </Text>
          </View>
        )}

        {/* ✅ Payment Details (chỉ hiển thị khi thành công) */}
        {paymentResult.status === "success" && (
          <>
            {paymentResult.transactionId && (
              <View style={styles.orderDetails}>
                <Text style={styles.orderLabel}>Mã giao dịch:</Text>
                <Text style={styles.orderCode}>{paymentResult.transactionId}</Text>
              </View>
            )}
            
            {paymentResult.bankCode && (
              <View style={styles.orderDetails}>
                <Text style={styles.orderLabel}>Ngân hàng:</Text>
                <Text style={styles.orderCode}>{paymentResult.bankCode}</Text>
              </View>
            )}
            
            {paymentResult.paymentTime && (
              <View style={styles.orderDetails}>
                <Text style={styles.orderLabel}>Thời gian:</Text>
                <Text style={styles.orderCode}>
                  {new Date(paymentResult.paymentTime).toLocaleString("vi-VN")}
                </Text>
              </View>
            )}
          </>
        )}

        {/* ✅ Action Buttons */}
        <View style={styles.buttonContainer}>
          {paymentResult.status === "success" ? (
            <>
              <TouchableOpacity style={styles.primaryButton} onPress={handleCheckOrder}>
                <Text style={styles.primaryButtonText}>Xem đơn hàng</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={handleGoHome}>
                <Text style={styles.secondaryButtonText}>Về trang chủ</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.primaryButton} onPress={handleBuyAgain}>
                <Text style={styles.primaryButtonText}>Mua lại</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={handleRetry}>
                <Text style={styles.secondaryButtonText}>Thử lại</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.secondaryButton, { marginTop: 10 }]} onPress={handleGoHome}>
                <Text style={styles.secondaryButtonText}>Về trang chủ</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ✅ Debug Buttons - chỉ hiển thị trong development */}
          {__DEV__ && (
            <>
              <TouchableOpacity 
                style={[styles.debugButton, { marginTop: 20 }]} 
                onPress={handleDebugOrder}
              >
                <Text style={styles.debugButtonText}>🔍 Debug Orders</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.debugButton} 
                onPress={handleTestCreateOrder}
              >
                <Text style={styles.debugButtonText}>🧪 Test Create Order</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.debugButton} 
                onPress={handleCheckConnection}
              >
                <Text style={styles.debugButtonText}>🔗 Kiểm tra kết nối</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.debugButton} 
                onPress={handleTestSimpleEndpoint}
              >
                <Text style={styles.debugButtonText}>🧪 Test Simple Endpoint</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.debugButton} 
                onPress={handleTestDirectEndpoint}
              >
                <Text style={styles.debugButtonText}>🧪 Test Direct Endpoint</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    textAlign: "center",
    color: "#333",
  },
  loadingSubtext: {
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
    color: "#666",
  },
  loadingDots: {
    flexDirection: "row",
    marginTop: 20,
  },
  dot: {
    fontSize: 20,
    color: "#1677ff",
    marginHorizontal: 5,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100%",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  successIcon: {
    backgroundColor: "#52c41a",
  },
  errorIcon: {
    backgroundColor: "#ff4d4f",
  },
  iconText: {
    fontSize: 40,
    color: "#fff",
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  successTitle: {
    color: "#52c41a",
  },
  errorTitle: {
    color: "#ff4d4f",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
    lineHeight: 24,
  },
  orderDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 10,
  },
  orderCode: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 30,
  },
  primaryButton: {
    backgroundColor: "#1677ff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#1677ff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d9d9d9",
  },
  secondaryButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
  debugButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  debugButtonText: {
    color: "#333",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default CheckVnPayMent;
