import { Request, Response, NextFunction, Router } from "express";
import Bill, { I_Bill } from "../models/Bill";
import validateJWT from "../middlewares/validateJWT";
import getByTxHash from "../helpers/getByTxHash";

const router = Router();

router.get(
  "/bill/:userId/:billId/txData",
  [
    /* validateJWT, */
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const { billId } = req.params;
    try {
      const bill: I_Bill[] = await Bill.find({
        _id: billId,
      }).lean();

      if (!bill) {
        res.status(400).json({ msg: "bill not found", payment: {} });
      }

      const txData = await getByTxHash(bill[0].payment.txHash);
      res.status(200).json({
        msg: `Transaction info of: ${bill[0].payment.txHash}`,
        txData,
      });
    } catch (error) {}
  }
);

export default router;
