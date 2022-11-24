import { Request, Response, NextFunction, Router } from "express";
import validateAdminRole from "../middlewares/validateAdminRole";
import Bill, { I_Bill } from "../models/Bill";

const router = Router();

const BASE_DATE = new Date(1900, 0, 1);

router.get(
  "/billReport",
  [validateAdminRole],
  async (req: Request, res: Response, next: NextFunction) => {
    const { dateFrom, dateTo } = req.query;

    let from, to;
    dateFrom ? (from = dateFrom) : (from = BASE_DATE);
    dateTo ? (to = dateTo) : (to = new Date());

    try {
      const bills: I_Bill[] = await Bill.find({
        creationDate: {
          $gte: from,
          $lt: to,
        },
      }).lean();

      const report = await createReport(bills, { dateFrom, dateTo });

      res.status(200).json({ report: report });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

async function createReport(
  Bills: I_Bill[],
  dates: { dateFrom: any; dateTo: any }
): Promise<I_Report> {
  let report: I_Report = {
    date_from: dates.dateFrom,
    date_to: dates.dateTo,
    amount_bills: Bills.length,
    amount_payments: calculateAmountPayments(Bills),
    amount_users: calculateAmountUsers(Bills),
    payment_types: calculatePaymentTypes(Bills),
  };

  return report;
}

function calculateAmountPayments(Bills: I_Bill[]): number {
  let acummulated = 0;
  Bills.forEach((bill) => {
    acummulated += bill.payment.amount;
  });
  return acummulated;
}

function calculateAmountUsers(Bills: I_Bill[]): number {
  let users = [];
  Bills.forEach((bill) => {
    !users.includes(bill.idUser) ? users.push(bill.idUser) : null;
  });

  return users.length;
}

function calculatePaymentTypes(Bills: I_Bill[]) {
  let types = {
    blockchain: 0,
    other: 0,
  };
  Bills.forEach((bill) => {
    !bill.payment.network ? (types.blockchain += 1) : (types.other += 1);
  });

  return types;
}

interface I_Report {
  date_from: Date;
  date_to: Date;
  amount_bills: number;
  amount_payments: number;
  amount_users: number;
  payment_types: {
    blockchain: number;
    other?: number;
  };
}

export default router;
