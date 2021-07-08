export interface invoiceApiInterface {
  id: string
  socid: string
  fk_project: string
  date: number
  datem: number
  date_creation: number
  date_validation: number
  date_modification: number
  remise_absolue: string
  remise_percent: string
  total_ht: string
  paye: "1" | "0"
  statut: string
  totalpaid: string
  remaintopay: string
}
