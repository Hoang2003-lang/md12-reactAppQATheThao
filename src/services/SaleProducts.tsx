import API from '../api';

// Lấy tất cả sản phẩm khuyến mãi
export const fetchSaleProducts = async () => {
  try {
    const res = await API.get('/sale-products');
    const products = Array.isArray(res.data) ? res.data : res.data?.data || [];

    return products.map((product: any) => ({
      ...product,
      sold: product.sold || 0
    }));
  } catch (err) {
    console.error('❌ Lỗi lấy sản phẩm khuyến mãi:', err);
    return [];
  }
};

// Lấy tất cả sản phẩm giảm giá (giữ lại luôn, không lọc isDiscount nữa)
export const getDiscountProducts = async () => {
  try {
    const res = await API.get('/sale-products');
    const products = res.data?.data || [];

    if (!Array.isArray(products)) {
      throw new Error('API không trả về danh sách sản phẩm hợp lệ.');
    }

    return products.map((product: any) => ({
      ...product,
      sold: product.sold || 0
    }));
  } catch (error) {
    console.error('❌ Lỗi khi lấy sản phẩm khuyến mãi:', error);
    return [];
  }
};