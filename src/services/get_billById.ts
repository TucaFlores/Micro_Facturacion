import { Request, Response, NextFunction, Router } from "express";
import validateJWT from "../middlewares/validateJWT";
import Bill, { I_Bill } from "../models/Bill";

const router = Router();

router.get(
  "/bill/:userId/:billId",
  [
    /* validateJWT, */
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, billId } = req.params;
    try {
      const bill: I_Bill[] = await Bill.find({
        _id: billId,
        idUser: userId,
      }).lean();

      if (!bill) {
        res.status(400).json({ msg: "bill not found", payment: {} });
      }
      res.status(200).json({ bill: bill[0] });
    } catch (error) {}
  }
);

export default router;
