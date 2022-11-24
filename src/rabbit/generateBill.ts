import { Channel, ConsumeMessage } from "amqplib";
import axios from "axios";
import Bill, { I_Bill, I_Order } from "../models/Bill";
import { publish } from "./rabbitRepo";

const consumer =
  (channel: Channel) =>
  async (msg: ConsumeMessage | null): Promise<void> => {
    if (msg) {
      const payload: I_PaymentMessage = JSON.parse(msg.content.toString());

      console.log(payload);

      const newBill: I_Bill = {
        creationDate: new Date(),
        idUser: payload.userId,
        orderId: payload.orderId,
        payment: {
          type: payload.paymentMethod,
          txHash: payload.paymentInfo.txHash,
          addressFrom: payload.paymentInfo.fromAddress,
          amount: payload.paymentInfo.amount,
          network: payload.paymentInfo.network,
          paymentDate: payload.paymentInfo.paymentDate,
        },
      };
      try {
        await Bill.create(newBill);

        publish("bill", JSON.stringify(newBill));
      } catch (error) {
        console.log(error);
      }

      channel.ack(msg);
    }
  };

export default consumer;

interface I_PaymentMessage {
  orderId: string;
  userId: string;
  paymentMethod: string;
  paymentInfo: {
    fromAddress: string;
    amount: number;
    txHash: string;
    paymentDate: Date;
    network: string;
  };
}
