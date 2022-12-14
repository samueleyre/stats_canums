export interface moneyStatsInterface {
  projectsIncome?: {
    projected: {
      total: number,
      invoiceCount: number
    },
    paid: {
      total: number,
      invoiceCount: number
    },
    unpaid: {
      total: number,
      invoiceCount: number
    }
  },
  distributionProjected?: {
    capitaine: number,
    cellule: number,
    apportAffaire: number,
    brand: number,
    freelances: {
      total: number,
      countInvoices: number,
      countFreelances: number,
      averagePerFreelance: number
    }
  },
  structure: {
    income?: {
      projected: number,
      paid: number
    }
    expenses? : {
      reelTotal: number,
      detail: {
        banque: number,
        assurance: number,
        communication: number,
        outils_numeriques: number,
        materiel: number,
        restauration: number,
        team_building: number,
        facilitation: number,
        bureau: number,
        trading: number,
        conseil: number
      }
    },
    taxes?: number,
    realTreasury: number
  },
}
