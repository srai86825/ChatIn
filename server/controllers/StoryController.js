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
    const prisma = getPrismaInstance();
    const stories = await prisma.stories.findMany();
    console.log("fetched stories: ",stories)
    res.status(200).json(stories);
  } catch (error) {
    console.log("Couldn't fetch stories", error);
  }
};