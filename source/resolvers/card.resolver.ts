import { Arg, Ctx, Int, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Between, FindOperator, MoreThanOrEqual } from "typeorm";
import { dataSource } from "../dataSource";
import { Card } from "../entity";
import { AllowIf } from "../middlewares/AllowIf";
import { Authenticate } from "../middlewares/Authenticate";
import { CardRepository } from "../repository";
import { ContextType } from "../types";

@Resolver(Card)
export class CardResolver {
  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('create-card'))
  @Mutation(() => Card)
  async addCard(
    @Arg('title') title: string,
    @Arg('description', { nullable: true }) description: string | null,
    @Arg('columnId', () => Int) columnId: number,
    @Ctx() { }: ContextType): Promise<Card | null> {
    const card = new Card()

    card.title = title
    card.description = description
    card.index = await CardRepository.countBy({ columnId })
    card.columnId = columnId

    await CardRepository.save(card)

    return card
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('update-card'))
  @Mutation(() => Card, { nullable: true })
  async updateCard(
    @Arg('id', () => Int) id: number,
    @Arg('title', { nullable: true }) title: string | null,
    @Arg('description', { nullable: true }) description: string | null,
    @Ctx() { }: ContextType): Promise<Card | null> {
    const card = await CardRepository.findOneBy({ id })

    card.title = title ?? card.title
    card.description = description ?? card.description

    await CardRepository.save(card)

    return card
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('update-card'))
  @Mutation(() => Card, { nullable: true })
  async moveCard(
    @Arg('id', () => Int) id: number,
    @Arg('toIndex', () => Int) toIndex: number,
    @Arg('toColumnId', () => Int) toColumnId: number,
    @Ctx() { }: ContextType): Promise<Card | null> {
    const card = await CardRepository.findOneBy({ id })
    const fromIndex = card.index
    const isMovingUp = toIndex > fromIndex

    await dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Card)

      let method: "increment" | 'decrement' = undefined
      let operator: FindOperator<number> = undefined

      if (isMovingUp) {
        method = 'decrement'
        operator = Between(fromIndex + 1, toIndex)
      } else {
        method = 'increment'
        operator = MoreThanOrEqual(toIndex)
      }

      await repository[method]({ index: operator, columnId: toColumnId }, 'index', 1)
      await repository.update({ id }, { index: toIndex })
    })

    return { ...card, index: toIndex }
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('delete-card'))
  @Mutation(() => Int, { nullable: true })
  async removeCard(
    @Arg('id', () => Int) id: number,
    @Ctx() { }: ContextType): Promise<number | null> {
    await CardRepository.delete({ id })

    return id
  }
}
