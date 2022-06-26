import slugify from 'slugify'
import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent } from "typeorm";
import { Project } from "../entity";

const createSlug = (string: string, sufix: string | number) => slugify(string, { strict: true, }) + '-' + sufix

@EventSubscriber()
export class ProjectSubscriber implements EntitySubscriberInterface<Project> {
  listenTo = () => Project

  async afterInsert({ entity, manager }: InsertEvent<Project>) {
    const repository = manager.getRepository(Project)
    await repository.update({ id: entity.id }, { slug: createSlug(entity.title, entity.id) })
  }

  async beforeUpdate({ entity }: UpdateEvent<Project>) {
    if (entity.title) {
      entity.slug = createSlug(entity.title, entity.id)
    }
  }
}
