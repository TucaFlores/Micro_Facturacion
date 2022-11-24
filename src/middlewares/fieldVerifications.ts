import PendingPayment from "../models/Bill";
import { E_Sort } from "../utils/enums";

const fieldVerifications = {
  sortEnum: (sort: string) => {
    if (sort == undefined) return true;
    let sortValidation = (E_Sort as any)[String(sort).toLowerCase()];
    if (!sortValidation) {
      throw new Error(`-- ${sort} -- is not valid for param "sort"`);
    }
    return true;
  },
};

export default fieldVerifications;
