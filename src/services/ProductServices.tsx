import API from '../api';

export const fetchAllProducts = async () => {
  try {
    const res = await API.get('/products');
    // Đảm bảo mỗi sản phẩm có thông tin sold
    const products = res.data.map((product: any) => ({
      ...product,
      sold: product.sold || 0
    }));
    return products;
  } catch (err) {
    console.error('❌ Lỗi lấy sản phẩm:', err);
    return [];
  }
};

export const fetchProductById = async (id: string) => {
  try {
    const res = await API.get(`/products/${id}`);
    const product = res.data;
    // Đảm bảo sản phẩm có thông tin sold
    return {
      ...product,
      sold: product.sold || 0
    };
  } catch (err) {
    console.error(`❌ Lỗi lấy sản phẩm ${id}:`, err);
    return null;
  }
};
