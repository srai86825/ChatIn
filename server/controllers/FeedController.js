import getPrismaInstance from "../utils/PrismaClient.js";
import OpenAI from "openai";
import { prompts } from "../utils/prompts.js";
import { iceBreaker, wouldYouRather } from "../utils/demoPromptOutputs.js";

// export const fetchFeed = async (req, res, next) => {
//   try {
//     const { userId } = req.params;
//     const prisma = getPrismaInstance();
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       include: {
//         apiKeys: true,
//       },
//     });
//     //   console.log(user);
//     const apiKeyObject = user.apiKeys[0];

//     if (apiKeyObject.provider === "openai") {
//       const openai = new OpenAI({
//         apiKey: apiKeyObject.key,
//       });

//       const wouldYouRatherResponse = await openai.chat.completions.create({
//         messages: [
//           {
//             role: "user",
//             content: prompts.wouldYouRather,
//           },
//         ],
//         model: "gpt-3.5-turbo",
//       });
//       const seperatedQuestion =
//         wouldYouRatherResponse.choices[0].message.content.split("#");
//       const wouldYouRatherQuestion = {
//         question: seperatedQuestion[0],
//         options: seperatedQuestion.filter((m, i) => i !== 0),
//       };

//       const icebreaker = await openai.chat.completions.create({
//         messages: [
//           {
//             role: "user",
//             content: prompts.iceBreaker,
//           },
//         ],
//         model: "gpt-3.5-turbo",
//       });

//       const icebreakers = icebreaker.choices[0].message.content.split("#");

//       return res.status(200).json({ wouldYouRatherQuestion, icebreakers });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error });
//   }
// };

export const fetchFeed = (req, res, next) => {
  try {
    const wyr = wouldYouRather.split("@");
    const iceb = iceBreaker.split("@");
    const selectedWYR =
      wyr[Math.floor(Math.random() * wyr.length)].split("#");
    const selectedICEB =
      iceb[Math.floor(Math.random() * iceb.length)].split("#");

    const wouldYouRatherQuestion={
      question:selectedWYR[0],
      options:selectedWYR.filter((item,i)=>i!==0)
    }
    const icebreakerQuestion={
      question:selectedICEB[0],
      options:selectedICEB.filter((item,i)=>i!==0)
    }

    return res.status(200).json({ wouldYouRatherQuestion, icebreakerQuestion });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export const createPoll = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { options, question, selectedIndex } = req.body;
    const prisma = getPrismaInstance();

    const createdPoll = await prisma.poll.create({
      data: {
        question: question,
      },
    });

    options.map(async (op, i) => {
      const createdOption = await prisma.options.create({
        data: {
          option: op,
          pollId: createdPoll.id,
        },
        include: {
          forPoll: true,
        },
      });

      if (i === selectedIndex) {
        await prisma.answers.create({
          data: {
            optionId: createdOption.id,
            pollId: createdPoll.id,
            userId: userId,
          },
          include: {
            selectedBy: true,
            forPoll: true,
            optionSelected: true,
          },
        });
      }
    });
    return res.status(201).json({ message: "created successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const fetchPolls = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    await prisma.poll
      .findMany({
        include: {
          options: {
            include: {
              answers: true,
            },
          },
        },
      })
      .then((polls) => {
        const updatedPolls = polls.map((poll) => {
          const updatedPollOptions = poll.options.map((op) => {
            return {
              ...op,
              answers: op.answers.length,
            };
          });
          return {
            ...poll,
            options: updatedPollOptions,
          };
        });

        return res.status(200).json({ polls: updatedPolls });
      });

    // console.log(polls);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const attemptPoll = async (req, res, next) => {
  try {
    const { pollId, optionId } = req.body;
    const { userId } = req.params;

    const prisma = getPrismaInstance();
    await prisma.answers
      .create({
        data: {
          optionId: optionId,
          pollId: pollId,
          userId: userId,
        },
        include: {
          selectedBy: true,
          forPoll: true,
          optionSelected: true,
        },
      })
      .then(() => {
        return res.status(202).json({ message: "Attempted successfully" });
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
