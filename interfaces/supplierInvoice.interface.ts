export interface supplierInvoiceApiInterface {
  id: string
  fk_soc: string
  datec: number
  total_ht: string
  paid: "1" | "0"
}
