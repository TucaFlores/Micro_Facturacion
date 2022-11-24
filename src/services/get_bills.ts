import { Request, Response, NextFunction, Router } from "express";
import { check } from "express-validator";
import fieldVerifications from "../middlewares/fieldVerifications";
import validateRequest from "../middlewares/validateRequest";
import { E_Sort } from "../utils/enums";
import validateJWT from "../middlewares/validateJWT";
import Bill, { I_Bill } from "../models/Bill";

const router = Router();

const BASE_DATE = new Date(1900, 0, 1);

router.get(
  "/bill/:userId",
  [
    /* validateJWT, */
    check("sort").custom(fieldVerifications.sortEnum),
    validateRequest,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    const { dateFrom, dateTo, sort } = req.query;

    let from, to, sorting;
    dateFrom ? (from = dateFrom) : (from = BASE_DATE);
    dateTo ? (to = dateTo) : (to = new Date());
    sort
      ? (sorting = (E_Sort as any)[String(sort).toLowerCase()])
      : (sorting = E_Sort.ascending);

    try {
      const bills: I_Bill[] = await Bill.find({
        idUser: userId,
        creationDate: {
          $gte: from,
          $lt: to,
        },
      })
        .sort({ creationDate: sorting })
        .lean();

      let billsDTO: I_Bill[] = [];
      billsDTO = bills.map((bill: I_Bill): I_Bill => {
        const billDTO: I_Bill = { ...bill };
        return billDTO;
      });

      res.status(200).json({ amountBills: billsDTO.length, bill: billsDTO });
    } catch (error) {}
  }
);

export default router;
