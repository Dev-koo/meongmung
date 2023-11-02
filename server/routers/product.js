const { Router } = require('express');
const productController = require('../controllers/productController');

const router = Router();

// 전체 상품 조회
router.get('/products', productController.getAllProducts);

// 상품 상세 조회
router.get('/products/:id', productController.getProductById);

router.get(
  '/products/categorys/:name',
  productController.getProductByCategoryName,
);

// 상품 생성
router.post('/products', productController.createProduct);

// 상품 수정
router.put('/products/:id', productController.updateProduct);

// 상품 삭제
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;
