import { dataSource } from "../dataSource";
import { Project } from "../entity";

export const ProjectRepository = dataSource.getRepository(Project)
