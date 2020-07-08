import EmfV5 from '../EmfV5';

EmfV5('inflow', '1038');
EmfV5('conv', '1038', {
  emf_campaign: 'emf_public',
  adv_conversion_id: '33',
  conv_val_1: '서울',
  reg_chk: 'true',
});
EmfV5('conv', '1038', {
  emf_campaign: 'emf_ecommerce',
  adv_conversion_id: '44', // 장바구니 담기
  conv_val_1: '서울',
  reg_chk: 'true',
  product_id: '100254',
  sales_price: '5600',
  product_name: '한샘매장상품 PLEX 일반책상 1200_D76',
  product_quantity: '1',
  product_category: '가구/인테리어',
});
EmfV5('conv', '1038', {
  emf_campaign: 'emf_ecommerce',
  adv_conversion_id: '55', // 구매완료
  reg_chk: 'true',
  order_id: '13412341234',
  sales_price: '25600',
  currency: 'KRW',
  product_quantity: '5',
  product_id: '1002513',
  shipping: '3000',
  order_items: [
    {
      item_id: '100251',
      item_name: '[아가방]아기파우더',
      item_category: '화장품 > 파우더',
      item_quantity: '4',
      item_price: '5000',
    },
    {
      item_id: '100254',
      item_name: '한샘매장상품 PLEX2 일반책상 1200_D76',
      item_category: '가구/인테리어',
      item_quantity: '1',
      item_price: '5600',
    },
  ],
});
