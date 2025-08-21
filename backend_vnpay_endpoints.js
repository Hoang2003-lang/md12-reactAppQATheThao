// Backend endpoints cho VNPay payment result
// Thêm vào file routes của backend

// Endpoint để lấy kết quả thanh toán từ cache hoặc database
router.get("/get_payment_result", async (req, res) => {
  try {
    const { order_code } = req.query;
    
    if (!order_code) {
      return res.status(400).json({
        success: false,
        message: "Thiếu order_code parameter",
        data: null
      });
    }
    
    console.log("🔍 Tìm kiếm kết quả thanh toán cho order:", order_code);
    
    // ✅ Thử lấy từ cache trước
    if (global.paymentResults && global.paymentResults[order_code]) {
      const cachedResult = global.paymentResults[order_code];
      console.log("✅ Tìm thấy trong cache:", cachedResult);
      
      return res.json({
        success: true,
        message: "Lấy kết quả từ cache thành công",
        data: cachedResult
      });
    }
    
    // ✅ Nếu không có trong cache, tìm trong database
    console.log("🔍 Tìm kiếm trong database...");
    const order = await Order.findOne({ order_code: order_code });
    
    if (!order) {
      console.log("❌ Không tìm thấy đơn hàng trong database");
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
        data: null
      });
    }
    
    console.log("✅ Tìm thấy đơn hàng:", order.order_code, "Status:", order.status);
    
    // ✅ Tạo kết quả từ database
    let paymentResult = {
      orderId: order.order_code,
      timestamp: order.updated_at || order.created_at
    };
    
    if (order.status === 'paid' && order.paymentStatus === 'completed') {
      paymentResult.status = 'success';
      paymentResult.amount = order.paymentDetails?.amount || order.total_amount;
      paymentResult.transactionId = order.paymentDetails?.transactionId;
      paymentResult.bankCode = order.paymentDetails?.bankCode;
      paymentResult.paymentTime = order.paymentDetails?.paymentTime;
    } else if (order.status === 'payment_failed' || order.paymentStatus === 'failed') {
      paymentResult.status = 'failed';
      paymentResult.errorCode = order.paymentDetails?.errorCode;
      paymentResult.errorMessage = order.paymentDetails?.errorMessage || 'Thanh toán thất bại';
    } else {
      paymentResult.status = 'pending';
      paymentResult.message = 'Đơn hàng đang chờ thanh toán';
    }
    
    // ✅ Lưu vào cache để lần sau truy cập nhanh hơn
    if (!global.paymentResults) global.paymentResults = {};
    global.paymentResults[order_code] = paymentResult;
    
    console.log("✅ Trả về kết quả từ database:", paymentResult);
    
    return res.json({
      success: true,
      message: "Lấy kết quả từ database thành công",
      data: paymentResult
    });
    
  } catch (error) {
    console.error("❌ Lỗi khi lấy kết quả thanh toán:", error);
    
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy kết quả thanh toán",
      error: error.message,
      data: null
    });
  }
});

// Endpoint để debug orders (đã có sẵn)
router.get("/debug/orders", async (req, res) => {
  try {
    const orders = await Order.find({}, { 
      order_code: 1, 
      status: 1, 
      paymentStatus: 1, 
      total_amount: 1, 
      createdAt: 1, 
      updated_at: 1,
      paymentDetails: 1
    })
    .sort({ createdAt: -1 })
    .limit(10);
    
    console.log("📋 Debug orders:", orders);
    
    return res.json({
      success: true,
      total: orders.length,
      orders: orders
    });
  } catch (error) {
    console.error("❌ Debug orders error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi khi debug orders",
      error: error.message
    });
  }
});

// Endpoint để check order status
router.get("/check_order_status", async (req, res) => {
  try {
    const { order_code } = req.query;
    
    if (!order_code) {
      return res.status(400).json({
        success: false,
        message: "Thiếu order_code parameter"
      });
    }
    
    const order = await Order.findOne({ order_code: order_code });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng"
      });
    }
    
    return res.json({
      success: true,
      data: {
        order_code: order.order_code,
        status: order.status,
        paymentStatus: order.paymentStatus,
        total_amount: order.total_amount,
        createdAt: order.created_at,
        updated_at: order.updated_at,
        paymentDetails: order.paymentDetails
      }
    });
  } catch (error) {
    console.error("❌ Check order status error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi khi kiểm tra trạng thái đơn hàng",
      error: error.message
    });
  }
});

// Endpoint để lấy danh sách thanh toán theo trạng thái
router.get("/payment_list", async (req, res) => {
  try {
    const { status, limit = 20 } = req.query;
    
    let query = {};
    if (status) {
      if (status === 'success') {
        query = { status: 'paid', paymentStatus: 'completed' };
      } else if (status === 'failed') {
        query = { 
          $or: [
            { status: 'payment_failed' },
            { paymentStatus: 'failed' }
          ]
        };
      } else if (status === 'pending') {
        query = { 
          $and: [
            { status: { $ne: 'paid' } },
            { status: { $ne: 'payment_failed' } }
          ]
        };
      }
    }
    
    const orders = await Order.find(query, { 
      order_code: 1, 
      status: 1, 
      paymentStatus: 1, 
      total_amount: 1, 
      createdAt: 1, 
      updated_at: 1,
      paymentDetails: 1
    })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));
    
    console.log("📋 Payment list:", { status, count: orders.length });
    
    return res.json({
      success: true,
      total: orders.length,
      status: status || 'all',
      orders: orders
    });
  } catch (error) {
    console.error("❌ Payment list error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách thanh toán",
      error: error.message
    });
  }
});

