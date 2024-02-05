import getPrismaInstance from "../utils/PrismaClient.js";

export const addStory = async (req, res, next) => {
  try {
    const { story } = req.body;
    const prisma = getPrismaInstance();
    const user = story.senderId;
    console.log(story, user);
    const newStory = await prisma.stories.create({
      data: {
        creator: { connect: { id: user } },
        message: story.message,
        type: story.type,
      },
      include: { creator: true },
    });

    return res.status(200).json(newStory);
  } catch (error) {
    console.log(error);
    next(error);
  }
};



export const fetchStories = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const prisma = getPrismaInstance();
    let stories;
    if (!userId) {
      stories = await prisma.user.findMany({
        where: { stories: { some: {} } },
        select: {
          profilePicture: true,
          id: true,
          name: true,
          stories: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });
    } else {
      console.log("UserId stories are being fetched", userId);
      stories = await prisma.user.findMany({
        where: { id: userId },
        select: {
          profilePicture: true,
          id: true,
          name: true,
          stories: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });
    }
    // console.log("fetched stories: ", stories);
    res.status(200).json(stories);
  } catch (error) {
    console.log("Couldn't fetch stories", error);
    next(error);
  }
};
