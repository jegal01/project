import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();

// [심화] 라우터마다 prisma 클라이언트를 생성하고 있다. 더 좋은 방법이 있지 않을까?
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty',
});

// [필수] 3. 캐릭터 생성
router.post('/character/create', async (req, res) => {
  try {
    const characterId = req.body.character_id;
    const characterName = req.body.character_name;
    const characterHealth = req.body.character_health;
    const characterPower = req.character_power;

    const createcharacer = await prisma.character.create({
      data: {
        characterId: characterId,
        characterName: characterName,
        characterHealth: characterHealth,
        characterPower: characterPower,
      },
    });

    res.status(200).json({ character_info: createcharacer });
    console.log(createcharacer);
  } catch (error) {
    res.status(500).json({ error: `캐릭터 생성에 실패 했습니다` });
    console.log(error);
  }



});

// [필수] 4. 캐릭터 삭제
router.post('/character/delete', (req, res) => { });

// [필수] 5. 캐릭터 상세 조회
router.get('/character/detail', async (req, res) => {
  const { characterId } = req.params;
  const char = await prisma.character.findcharter({
    where: {
      characterId: +characterId,
    },

    data: {
      characterId: characterId,
      characterName: characterName,
      characterHealth: characterHealth,
      characterPower: characterPower,
    },
  });
  return res.status.apply(200).json({ character_info: char });
});

// 6-3. [도전] "회원"에 귀속된 캐릭터를 생성하기
router.post('/character/createfromuser', (req, res) => { });

// 6-4. [도전] "회원"에 귀속된 캐릭터를 삭제하기
router.post('/character/createfrom', (req, res) => { });

export default router;
