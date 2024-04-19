import {Request, Response, NextFunction} from 'express';
import topicsService from 'services/topics/topics.service';
export async function checkAndCreateTopics(req: Request, res: Response, next: NextFunction) {
  const topics = req.body.topics;

  try {
    const existingTopics = await topicsService.getList();

    const updatedTopicIds = await Promise.all(
      topics.map(async topicId => {
        const existingTopic = existingTopics.find(
          topic => topic._id.toString() === topicId.toString()
        );

        if (existingTopic) {
          return existingTopic._id.toString();
        } else {
          const newTopicName = topicId.toLowerCase();
          const newTopic = await topicsService.createTopic({name: newTopicName});
          return newTopic._id.toString();
        }
      })
    );

    req.body.topics = updatedTopicIds;

    next();
  } catch (error) {
    next(error);
  }
}
