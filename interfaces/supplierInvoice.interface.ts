export interface supplierInvoiceApiInterface {
  id: string
  creation_year: number
  fk_soc: string
  fk_project: string
  datec: number
  total_ht: string
  paid: "1" | "0"
  statut: "0"|"1"|"2"|"3" // draft | unpaid | paid | cancelled
}
