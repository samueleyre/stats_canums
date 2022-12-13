import {invoiceApiInterface} from "../interfaces/invoice.interface";

export class InvoiceEntity {
  id: string
  creation_year: number
  socid: string
  fk_project: string
  date: number
  datem: number
  date_creation: number
  date_validation: number
  date_modification: number
  remise_absolue: string
  remise_percent: string
  total_ht: number
  paye: "1" | "0"
  statut: "0"|"1"|"2"|"3" // draft | unpaid | paid | cancelled
  totalpaid: string
  remaintopay: string
  pourcentcapitaine?: number
  pourcentmarquehd?: number
  pourcentapportaffaire?: number
  pourcentcellule?: number

  constructor(object: invoiceApiInterface) {

    if ('id' in object) {
      this.id = object.id;
    }
    if ('socid' in object) {
      this.socid = object.socid;
    }
    if ('fk_project' in object) {
      this.fk_project = object.fk_project;
    }
    if ('date' in object) {
      this.date = object.date;
    }
    if ('datem' in object) {
      this.datem = object.datem;
    }
    if ('date_creation' in object) {
      this.date_creation = object.date_creation;
      this.creation_year = (new Date(object.date_creation*1000)).getFullYear();
    }
    if ('date_validation' in object) {
      this.date_validation = object.date_validation;
    }
    if ('date_modification' in object) {
      this.date_modification = object.date_modification;
    }
    if ('remise_absolue' in object) {
      this.remise_absolue = object.remise_absolue;
    }
    if ('remise_percent' in object) {
      this.remise_percent = object.remise_percent;
    }
    if ('total_ht' in object) {
      this.total_ht = Math.trunc(Number(object.total_ht));
    }
    if ('paye' in object) {
      this.paye = object.paye;
    }
    if ('statut' in object) {
      this.statut = object.statut;
    }
    if ('totalpaid' in object) {
      this.totalpaid = object.totalpaid;
    }
    if ('remaintopay' in object) {
      this.remaintopay = object.remaintopay;
    }
  }
}
