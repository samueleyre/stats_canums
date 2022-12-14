export interface projectApiInterface {
  id: string
  title: string
  date_c: number
  date_m: number
  date_start: number
  date_validation: null
  description: string;
  opp_amount: null
  opp_percent: string
  opp_status: string
  socid: string
  array_options: {
    options_pourcentcapitaine: string,
    options_pourcentmarquehd: string,
    options_pourcentapportaffaire: string,
    options_pourcentcellule: string
  }
}
