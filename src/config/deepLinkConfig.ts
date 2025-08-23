// Deep link configuration for payment result (đồng bộ với BE)
export const DEEP_LINK_CONFIG = {
  // Deep link base URL for mobile app
  BASE_URL: "f7shop://payment-result",
  // Fallback web URL if deep link fails (đồng bộ với BE returnUrl)
  FALLBACK_URL: "http://10.0.2.2:3002/vnpay/payment-result",
  // Universal link for iOS/Android
  UNIVERSAL_LINK: "https://f7shop.com/payment-result"
};

// Helper function to create deep link URL (đồng bộ với BE redirect)
export const createDeepLinkUrl = (orderCode: string, status: string, amount?: number, transactionId?: string, errorCode?: string, errorMessage?: string) => {
  const params = new URLSearchParams({
    orderId: orderCode,
    status: status,
    timestamp: Date.now().toString()
  });
  
  if (amount) {
    params.append('amount', amount.toString());
  }
  
  if (transactionId) {
    params.append('transactionId', transactionId);
  }
  
  if (errorCode) {
    params.append('errorCode', errorCode);
  }
  
  if (errorMessage) {
    params.append('errorMessage', errorMessage);
  }
  
  return `${DEEP_LINK_CONFIG.BASE_URL}?${params.toString()}`;
};

// Helper function to create universal link URL
export const createUniversalLinkUrl = (orderCode: string, status: string, amount?: number, transactionId?: string, errorCode?: string, errorMessage?: string) => {
  const params = new URLSearchParams({
    orderId: orderCode,
    status: status,
    timestamp: Date.now().toString()
  });
  
  if (amount) {
    params.append('amount', amount.toString());
  }
  
  if (transactionId) {
    params.append('transactionId', transactionId);
  }
  
  if (errorCode) {
    params.append('errorCode', errorCode);
  }
  
  if (errorMessage) {
    params.append('errorMessage', errorMessage);
  }
  
  return `${DEEP_LINK_CONFIG.UNIVERSAL_LINK}?${params.toString()}`;
};

// Helper function to parse deep link URL (đồng bộ với BE redirect)
export const parseDeepLinkUrl = (url: string) => {
  try {
    if (!url || !url.includes('f7shop://payment-result')) {
      return null;
    }

    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    
    return {
      orderId: params.get('orderId') || undefined,
      status: params.get('status') || undefined,
      amount: params.get('amount') ? Number(params.get('amount')) : undefined,
      transactionId: params.get('transactionId') || undefined,
      errorCode: params.get('errorCode') || undefined,
      errorMessage: params.get('errorMessage') || undefined,
      timestamp: params.get('timestamp') || undefined
    };
  } catch (error) {
    console.error("❌ Error parsing deep link URL:", error);
    return null;
  }
};

// Helper function to validate deep link data
export const validateDeepLinkData = (data: any) => {
  if (!data) return false;
  if (!data.orderId || !data.status) return false;
  if (data.status !== 'success' && data.status !== 'failed' && data.status !== 'error' && data.status !== 'invalid') return false;
  return true;
};

// Payment result status mapping (đồng bộ với BE)
export const PAYMENT_STATUS_MAP = {
  success: {
    title: "Thanh toán thành công",
    subtitle: "Đơn hàng của bạn đã được xử lý thành công"
  },
  failed: {
    title: "Thanh toán thất bại", 
    subtitle: "Thanh toán đã bị từ chối hoặc thất bại"
  },
  error: {
    title: "Lỗi hệ thống",
    subtitle: "Đã xảy ra lỗi trong quá trình xử lý thanh toán"
  },
  invalid: {
    title: "Dữ liệu không hợp lệ",
    subtitle: "Thông tin thanh toán không đúng hoặc đã bị thay đổi"
  }
};

// Debug function to log deep link configuration
export const debugDeepLinkConfig = () => {
  console.log("🔗 Deep Link Configuration:");
  console.log("Base URL:", DEEP_LINK_CONFIG.BASE_URL);
  console.log("Fallback URL:", DEEP_LINK_CONFIG.FALLBACK_URL);
  console.log("Universal Link:", DEEP_LINK_CONFIG.UNIVERSAL_LINK);
};