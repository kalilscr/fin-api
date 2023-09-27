import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { ICreateStatementDTO } from "./ICreateStatementDTO";
import { OperationType } from "../../entities/Statement";
@injectable()
export class CreateStatementUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ user_id, type, amount, description }: ICreateStatementDTO) {
    const user = await this.usersRepository.findById(user_id);

    if(!user) {
      throw new CreateStatementError.UserNotFound();
    }

    if(type === 'withdraw') {
      const { balance } = await this.statementsRepository.getUserBalance({ user_id });

      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds()
      }
    }

    const statementOperation = await this.statementsRepository.create({
      user_id,
      type,
      amount,
      description
    });

    return statementOperation;
  }

  async executeTransfer({ user_id, sender_id, type, amount }: ICreateStatementDTO) {
    const receiver = await this.usersRepository.findById(user_id);

    if(!receiver) {
      throw new CreateStatementError.UserNotFound();
    }

    const sender = await this.usersRepository.findById(String(sender_id));

    if(!sender) {
      throw new CreateStatementError.UserNotFound();
    }


    const { balance } = await this.statementsRepository.getUserBalance({ user_id: String(sender_id) });

    if (balance < amount) {
      throw new CreateStatementError.InsufficientFunds()
    }


    const transferSender = await this.statementsRepository.create({
      user_id: String(sender_id),
      type: OperationType.WITHDRAW,
      amount,
      description: `Sending transfer to ${receiver.name}`
    });


    const transferReceiver = await this.statementsRepository.create({
      sender_id,
      user_id,
      type,
      amount,
      description: `Receiving transfer from ${sender.name}`
    });

    return {
      sender: transferSender,
      receiver: transferReceiver
    }
  }
}
