import getPrismaInstance from "../utils/PrismaClient.js";
import { generateToken04 } from "../utils/TokenGenerator.js";

export const checkUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.json({ msg: "email is required.", status: false });
    }
    const prisma = getPrismaInstance();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.json({ msg: "user not found", status: false });
    } else return res.json({ msg: "user found", status: true, data: user });
  } catch (error) {
    console.log(error);
    next(err);
  }
};

export const onBoardUser = async (req, res, next) => {
  const { name, email, about, profilePicture } = req.body;
  console.log("user data received: ", name, email, profilePicture, about);
  try {
    if (!name || !email || !profilePicture) {
      return res.json({
        message: "insufficient or invalid userInfo",
        status: false,
      });
    }
    const prisma = getPrismaInstance();
    const user = await prisma.user.create({
      data: { email, profilePicture, about, name },
    });

    console.log("user created: ", user);
    return res.json({
      message: "user created successfully",
      status: true,
      user,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const users = await prisma.user.findMany({ orderBy: { name: "asc" } });
    const groupedByInitialLetters = {};
    users.forEach((user) => {
      let initalLetter = user.name.charAt(0).toUpperCase();
      if (!groupedByInitialLetters[initalLetter]) {
        groupedByInitialLetters[initalLetter] = [];
      }
      groupedByInitialLetters[initalLetter].push(user);
    });
    return res
      .status(200)
      .json({ status: true, users: groupedByInitialLetters });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const generateToken = (req, res, next) => {
  try {
    const appId = parseInt(process.env.ZEGO_APP_ID);
    const serverSecret = process.env.ZEGO_SERVER_SECRET;
    const userId = req.params.userId;
    const effectiveTime = 3600;
    const payload = "";

    if (appId && serverSecret && userId) {
      const token = generateToken04(
        appId,
        userId,
        serverSecret,
        effectiveTime,
        payload
      );

      return res.status(200).json({token: token});
    } else {
      console.log(
        "Insufficient data to generate token:",
        "appId:",
        appId,
        ",serverSecret:",
        serverSecret,
        ",userId:",
        userId
      );

      return res
        .status(400)
        .json({
          message:
            "Insufficient data to generate token:" +
            "appId:" +
            appId +
            ",serverSecret:" +
            serverSecret +
            ",userId:" +
            userId,
        });
    }
  } catch (error) {
    console.log("error generating token:", error);
    next(error);
  }
};
