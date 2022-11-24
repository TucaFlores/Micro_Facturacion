import mongoose from "mongoose";

const BillSchema = new mongoose.Schema({
  idUser: { type: String, required: true },
  creationDate: {
    type: Date,
    required: false,
    default: new Date(),
  },
  payment: {
    amount: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    txHash: {
      type: String,
      required: false,
    },
    paymentDate: {
      type: Date,
      required: false,
      default: new Date(),
    },
    addressFrom: {
      type: String,
      required: true,
    },
  },
  orderId: { type: String, required: true },
});

export default mongoose.model("Bill", BillSchema);

export interface I_Bill {
  _id?: string;
  creationDate: Date;
  idUser: string;
  payment: I_Payment;
  orderId: string;
}

export interface I_Payment {
  type?: string;
  amount: number;
  txHash?: string;
  paymentDate?: Date;
  addressFrom: string;
  network?: string;
}

export interface I_Order {}
