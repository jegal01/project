import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();

// [심화] 라우터마다 prisma 클라이언트를 생성하고 있다. 더 좋은 방법이 있지 않을까?
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty',
});

// [필수] 1. 아이템 생성
// 1. 아이템 코드, 아이템 명, 아이템 능력, 아이템 가격을 req(request)에서 json으로 전달받기
// 2. 데이터베이스에 아이템 저장하기
router.post('/item/create/:itemId', async (req, res) => {
  try {
    const itemCode = req.body.item_code;
    const itemName = req.body.item_name;
    const atk = req.body.atk;
    const price = req.body.price;

    const createItem = await prisma.item.create({
      data: {
        itemCode: itemCode,
        itemName: itemName,
        atk: atk,
        price: price,
      },
    });

    res.status(200).json({ item_info: createItem });
    console.log(createItem);
  } catch (error) {
    res.status(500).json({ error: `아이템 입력에 실패했습니다.` });
    console.log(error);
  }
});
//2. 아이템 리스트 조회
router.get('/item/list', async (req, res) => {
  const itemlist = await prisma.item.findMany({
    data: {
      itemCode: itemCode,
      itemName: itemName,
      atk: atk,
      price: price,
    },
  });
  return res.status.apply(200).json({ item_info: itemlist });
});

// [필수] 3. 특정 아이템 조회
// 아이템 코드는 URL의 parameter로 전달받기
router.get('/item/:itemCode', async (req, res) => {
  try {
    const itemCode = parseInt(req.params.findUnique({ where: { itemCode: itemCode } }));
    if (findItem == null) {
      res.status(404).json({ error: `그런 아이템은 존재하지 않습니다.` });
      return;
    }
    res.status(200).json({ item_info: findItem });
  } catch (error) {
    res.status(500).json({ error: `아이템 조회에 실패했습니다` });
    console.log(error);
  }
});

// [필수] 4. 특정 아이템 수정
// 아이템 코드는 URL의 parameter로 전달 받기
// 수정할 아이템 명, 아이템 능력을 req(request)에서 json으로 전달받기
router.post('/item/update', (req, res) => {
  prisma.item.update();
});

export default router;
