const { Router } = require('express');
const productController = require('../controllers/productController');
const { isAdmin } = require('../middleware/isAdmin');

const router = Router();

// 전체 상품 조회
router.get('/products', productController.getAllProducts);

// 상품 상세 조회
router.get('/products/:id', productController.getProductById);

// 특정 카테고리 상품 조회
router.get(
  '/categories/:name/products',
  productController.getProductByCategoryName,
);

// 상품 생성
router.post('/products', isAdmin, productController.createProduct);

// 상품 수정
router.put('/products/:id', isAdmin, productController.updateProduct);

// 상품 삭제
router.delete('/products/:id', isAdmin, productController.deleteProduct);

module.exports = router;
