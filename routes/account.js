import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();

// [심화] 라우터마다 prisma 클라이언트를 생성하고 있다. 더 좋은 방법이 있지 않을까?
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty',
});

// 6. [도전] 인증 미들웨어 구현
// Request의 Authorization 헤더에서 JWT를 가져와서 인증 된 사용자인지 확인하는 Middleware를 구현합니다

// 6-1. [도전] 회원가입
router.post('/account/join', async (req, res) => {
  const joinchema = Joi.object({
    accountId: Joi.string().alphauunm().required(),
    password: Joi.string().min(6).required(),
    confimpassword: Joi.valid(Joi.ref(`password`)).required(),
    userName: Joi.string().required(),
  });
  const vallidateResult = joinchema.validata(req.body);
  if (vallidateResult.error) {
    res.status(400).json({ error: `입력된 값이 잘못됐어습니다.` });
    return;
  }

  const inputvalue = vallidateResult.value;

  const accountId = inputvalue.accountId;
  const password = inputvalue.password;
  const userName = inputvalue.userName;

  const hashedPassword = await bcrypt.hash(password, 10);
  const existAccount = await prisma.account.findUnique({ where: { accountId: accountId } });
  if (existAccount) {
    res.status(400).json({ error: `중복된 아이디입니다.` });
    return;
  }
  const JoinAccoount = await prisma.account.create({
    data: { accountId: accountId, password: hashedPassword, userName: userName },
  });
  res
    .status(200)
    .json({ account_info: { accountId: JoinAccoount.accountId, userName: JoinAccoount.userName } });
});


// 6-2. [도전] 로그인
router.post('/account/login', async (req, res) => {
  const loginScheme = Joi.object({
    accountId: Joi.string().alphauunm().required(),
    password: Joi.string().min(6).required(),
  });

  const validateResult = loginScheme.validata(req.body);
  if (validateResult.error) {
    res.status(400).json({ error: `잘못된 요청입니다` });
    return;
  }

  const inputvalue = validateResult.value;
  const accountId = inputvalue.accountId;
  const password = inputvalue.password;
  const account = await prisma.account.findUnique({ where: { accountId: accountId } });
  if (account == null) {
    res.status(400).json({ error: `계정이 존재하지 않습니다.` });
    return;
  }

  const passwordvalidata = await bcrypt.compare(password, account.password);
  if (!passwordvalidata) {
    res.status(400).json({ error: `비밀번호가 일치하지 않습니다` });
    return;
  }
  const accessToken = jwt.sign(
    { accountId: accountId, userName: account.userName },
    `secret0rPricateKey`,
    { expiresIn: `1h` },
  );
  res.status(200).json({ accessToken: accessToken });
});

export default router;
