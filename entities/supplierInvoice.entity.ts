import {supplierInvoiceApiInterface} from "../interfaces/supplierInvoice.interface";

export class SupplierInvoiceEntity {
  id: string
  creation_year: number
  fk_soc: string
  datec: number
  total_ht: number
  paid: "1" | "0"

  constructor(object: supplierInvoiceApiInterface) {

    if ('id' in object) {
      this.id = object.id;
    }
    if ('fk_soc' in object) {
      this.fk_soc = object.fk_soc;
    }
    if ('datec' in object) {
      this.datec = object.datec;
      this.creation_year = (new Date(object.datec*1000)).getFullYear();
    }
    if ('total_ht' in object) {
      this.total_ht = Math.trunc(Number(object.total_ht));
    }
    if ('paid' in object) {
      this.paid = object.paid;
    }
  }
}
