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
        coworking: number
        banque: number
        hdParis: number
        maif: number
        communication: number
        hd: number
        visio: number
      }
    },
    taxes?: number,
    realTreasury: number
  },
}
