import {supplierInvoiceApiInterface} from "../interfaces/supplierInvoice.interface";

export class SupplierInvoiceEntity {
  id: string
  creation_year: number
  fk_soc: string // third partie id ( fournisseur )
  fk_project: string // project id
  datec: number
  total_ht: number
  paid: "1" | "0"
  statut: "0"|"1"|"2"|"3" // draft | unpaid | paid | cancelled
  thirdPartieTypentCode?: "TE_MEDIUM" | "TE_SMALL" | "TE_FREELANCE" | "TE_ADMIN" | "TE_OTHER"

  constructor(object: supplierInvoiceApiInterface) {

    if ('id' in object) {
      this.id = object.id;
    }
    if ('fk_soc' in object) {
      this.fk_soc = object.fk_soc;
    }
    if ('fk_project' in object) {
      this.fk_project = object.fk_project;
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
    if ('statut' in object) {
      this.statut = object.statut;
    }
  }
}
