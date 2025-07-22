import API from '../api';

export const fetchSaleProducts = async () => {
  try {
    const res = await API.get('/sale-products');
    return res.data?.data || [];
  } catch (err) {
    console.error('❌ Lỗi lấy sản phẩm khuyến mãi:', err);
    return [];
  }
};
// Lấy tất cả sản phẩm khuyến mãi (có isDiscount = true)
export const getDiscountProducts = async () => {
  try {
    const res = await API.get('/sale-products');
    // console.log('Kết quả API /sale-products:', res.data);

    const products = res.data.data; // 🔥 Đây mới là mảng sản phẩm

    if (!Array.isArray(products)) {
      throw new Error('API không trả về danh sách sản phẩm hợp lệ.');
    }

    // Lọc sản phẩm có isDiscount = true
    const discountProducts = products.filter(
      (product: any) => product.isDiscount === true
    );

    return discountProducts;
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm khuyến mãi:', error);
    return [];
  }
};
