import { renameSync } from "fs";
import getPrismaInstance from "../utils/PrismaClient.js";
import verifyId from "../utils/verifyObjectId.js";

export const addMessage = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const { message, to, from } = req.body;
    const getUser = onlineUsers.get(to);

    if (message && from && to) {
      const sender = { id: from };
      const receiver = { id: to };
      console.log("recvd msg: ",from,to)
      

      const newMessage = await prisma.messages.create({
        data: {
          message: message,
          sender: { connect: sender },
          receiver: { connect: receiver },
          messageStatus: getUser ? "delivered" : "sent",
        },
        include: { sender: true, receiver: true },
      });
      return res.status(201).json({ status: true, message: newMessage });
    }
    console.log(from, to, message);
    return res.status(400).json({
      status: false,
      message: "error occured cuz of insufficient data",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.params;
    if (verifyId(from) && verifyId(to)) {
      const prisma = getPrismaInstance();
      const messages = await prisma.messages.findMany({
        where: {
          receiverId: { not: undefined },
          senderId: { not: undefined },
          OR: [
            {
              senderId: from,
              receiverId: to,
            },
            {
              senderId: to,
              receiverId: from,
            },
          ],
        },
        orderBy: {
          createdAt: "asc",
        },
      });
      const unreadMessages = [];

      messages?.forEach((msg, i) => {
        if (msg.senderId === from && msg.messageStatus !== "read") {
          messages[i].messageStatus = "read";
          unreadMessages.push(msg.id);
        }
        // else{
        //   console.log("not reading cuz, msgSender:",msg.senderId,", and to: ",to," n msg status",msg.messageStatus)
        // }
      });

      //updating read status in db
      await prisma.messages.updateMany({
        where: {
          id: { in: unreadMessages },
        },
        data: {
          messageStatus: "read",
        },
      });

      res.status(200).json({
        status: true,
        messages: { allMessages: messages, unreadMessages: unreadMessages },
      });
    } else {
      console.log(from, to);
      res
        .status(404)
        .json({ message: "from and to must be valid", from: from, to: to });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const addImageMessage = async (req, res, next) => {
  try {
    console.log("request received", req.file.originalname);
    if (req.file) {
      const date = Date.now();
      let fileName =
        "uploads/images/img-" + date.toString() + req.file.originalname;
      renameSync(req.file.path, fileName);
      const prisma = getPrismaInstance();
      const { from, to } = req.query;

      if (from && to) {
        const message = await prisma.messages.create({
          data: {
            message: fileName,
            sender: { connect: { id: from } },
            receiver: { connect: { id: to } },
            type: "image",
          },
        });
        return res.status(201).json({ message: message });
      } else
        return res.status(400).json({
          status: false,
          message: "from and to is required",
          from: from,
          to: to,
        });
    } else
      return res
        .status(404)
        .send({ message: "file not valid or found", file: req.file });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const addAudioMessage = async (req, res, next) => {
  try {
    console.log("request received", req.file.originalname);
    if (req.file) {
      const date = Date.now();
      let fileName =
        "uploads/recordings/rec-" + date.toString() + req.file.originalname;
      renameSync(req.file.path, fileName);
      const prisma = getPrismaInstance();
      const { from, to } = req.query;

      if (from && to) {
        const message = await prisma.messages.create({
          data: {
            message: fileName,
            sender: { connect: { id: from } },
            receiver: { connect: { id: to } },
            type: "audio",
          },
        });
        return res.status(201).json({ message: message });
      } else
        return res.status(400).json({
          status: false,
          message: "from and to is required",
          from: from,
          to: to,
        });
    } else
      return res
        .status(404)
        .send({ message: "audio file is not valid or found", file: req.file });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getInitialUsersWithMessages = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const prisma = getPrismaInstance();
    console.log("User Id logged in: " + userId);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        sentMessages: {
          include: {
            sender: true,
            receiver: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        receivedMessages: {
          include: {
            sender: true,
            receiver: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    const messages = [...user.sentMessages, ...user.receivedMessages];
    messages.sort((a, b) => b.createdAt - a.createdAt);
    const users = new Map();
    //map for storing all the users who were chatting with the user "UserId".
    //it contains the user details,totalNumber of unread messages from the particular user.

    const messageStatusChange = [];

    messages.forEach((msg) => {
      const isSender = msg.senderId === userId;
      const calculatedId = isSender ? msg.receiverId : msg.senderId;
      if (msg.messageStatus === "sent" && !isSender) {
        messageStatusChange.push(msg.id);
        console.log("found undelivered message:", msg.id);
      }
      if (!users.has(calculatedId)) {
        const { id, createdAt, type, senderId, receiverId, messageStatus,message } =
          msg;

        let user = {
          messageId: id,
          type,
          createdAt,
          senderId,
          receiverId,
          messageStatus,
          message
        };

        if (isSender) {
          user = {
            ...user,
            totalUnreadMessages: 0,
            ...msg.receiver,
          };
        } else {
          user = {
            ...user,
            totalUnreadMessages: messageStatus === "read" ? 0 : 1,
            ...msg.sender,
          };
        }
        users.set(calculatedId, user);
      } else if (msg.messageStatus !== "read" && !isSender) {
        const user = users.get(calculatedId);
        users.set(calculatedId, {
          ...user,
          totalUnreadMessages: user.totalUnreadMessages + 1,
        });
      }
    });

    if (messageStatusChange.length) {
      console.log("Total undelived messages: " + messageStatusChange.length);
      await prisma.messages.updateMany({
        where: {
          id: { in: messageStatusChange },
        },
        data: {
          messageStatus: "delivered",
        },
      });
    }

    // console.log("Total users associated with: ", users.size);
    const result = Array.from(users, ([userId, data]) => {
      return { userId, data };
    });
    return res
      .status(200)
      .json({ users: result, onlineUsers: Array.from(onlineUsers.keys()) });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: error,
      message: "Unable to fetch unread messages with users",
    });
  }
};
