import get_billById from "./get_billById";
import get_billingReport from "./get_billingReport";
import get_bills from "./get_bills";
import get_transactionInfo from "./get_transactionInfo";

import utility from "./utility";

export default {
  paymentRoutes: [
    get_billingReport,
    get_bills,
    get_billById,
    get_transactionInfo,
  ],
  utilityRoutes: [utility],
};
