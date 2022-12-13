export interface supplierInvoiceApiInterface {
  id: string
  fk_soc: string
  datec: number
  total_ht: string
  paid: "1" | "0"
  statut: "0"|"1"|"2"|"3" // draft | unpaid | paid | cancelled
}
