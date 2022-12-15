import {projectApiInterface} from "../interfaces/project.interface";
import {ProjectEntity} from "../entities/project.entity";
import {moneyStatsInterface} from "../interfaces/stats.interface";
import {InvoiceEntity} from "../entities/invoice.entity";
import {invoiceApiInterface} from "../interfaces/invoice.interface";
import {structureProjetIds, structureProjets, structureThirdParties, structureThirdPartiesIds, treasury2020, structureExpensesThirdParties} from "@/lib/const";
import {SupplierInvoiceEntity} from "../entities/supplierInvoice.entity";
import {supplierInvoiceApiInterface} from "../interfaces/supplierInvoice.interface";
import { ThirdPartieEntity} from "../entities/thirdPartie.entity";
import {thirdPartieInterface} from "../interfaces/thirdPartie.interface";

export async function fetchApi(path = '') {

    const res = await fetch(`${process.env.CANUMS_API_URL}${path}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'DOLAPIKEY': process.env.DOLAPIKEY
        }
    })

    const json = await res.json()

    if (json.errors) {
        console.error(json.errors)
        throw new Error('Failed to fetch API')
    }

    return json;
}


export async function getStats(): Promise<{[key: number]: moneyStatsInterface}> {
    const current_year = new Date().getFullYear()

    const projets = await fetchProjects();
    const allInvoices = (await fetchInvoices()).filter(invoice => invoice.statut !== "0");
    const allSupplierInvoices = (await fetchSupplierInvoices()).filter(invoice => invoice.statut !== "0");
    const thirdparties = await fetchThirdParties();

    const allInvoicesUnpaid = allInvoices.filter(invoice => invoice.statut === "1");
    const allSupplierInvoicesUnpaid = allSupplierInvoices.filter(supInvoice => supInvoice.statut === "1");


    const ret = {
      2020: {
        structure: {
          realTreasury: treasury2020
        }
      }
    };

    // Calculate stats per year
    for (let year of process.env.YEARS.split(",").map(Number)) {

      // By Year
      const invoices = allInvoices.filter(invoice => invoice.creation_year === year);
      const supplierInvoices = allSupplierInvoices.filter(supInv => supInv.creation_year === year).map((supInv) => {

        // find projets
        const foundProjet = projets.find(pro => pro.id === supInv.fk_project);
        if (!foundProjet) {
            console.error(`Projet of supplier invoice ${supInv.id} not found !! 🧨`)
        }

        // find thirdPartie
        const foundThirdPartie = thirdparties.find(thirdPartie => thirdPartie.id === supInv.fk_soc);
        if (!foundThirdPartie) {
            console.error(`ThirdPartie of SupplierInvoice ${supInv.id} not found !! 🧨`)
        }

        supInv.clientId = foundProjet.socid // not used anymore
        supInv.isFreelance = Number(foundProjet.array_options.options_pourcentcellule) > 0 || foundProjet.socid !== null ? true : false

        // log freelance invoices found : can be useful to debug errors in total income
        // if (!supInv.isFreelance) {
        //   console.log(` name of project: ${foundProjet.title} with id ${foundProjet.id} is freelance ${supInv.isFreelance} and with thirdpartie : ${foundThirdPartie.id} ${foundThirdPartie.name} ${foundThirdPartie.name_alias}`)
        // }

        return supInv;
      })

      // Has been paid
      const paidInvoices = invoices.filter(invoice => invoice.paye === "1");
      const paidSupplierInvoices = supplierInvoices.filter(supInvoice => supInvoice.paid === "1");

      // Freelances
      const invoicesIndep = invoices.filter(inv => structureProjetIds.indexOf(inv.fk_project) === -1).map((inv) => {
          // find projets
          const foundProjet = projets.find(pro => pro.id === inv.fk_project);
          if (!foundProjet) {
              console.error(`Projet of invoice ${inv.id} not found !! 🧨`)
          }
          inv.pourcentapportaffaire = foundProjet.array_options.options_pourcentapportaffaire ? Number(foundProjet.array_options.options_pourcentapportaffaire) / 100 : 0
          inv.pourcentcellule = foundProjet.array_options.options_pourcentcellule ? Number(foundProjet.array_options.options_pourcentcellule) / 100 : 0
          inv.pourcentmarquehd = foundProjet.array_options.options_pourcentmarquehd ? Number(foundProjet.array_options.options_pourcentmarquehd) / 100 : 0
          inv.pourcentcapitaine = foundProjet.array_options.options_pourcentcapitaine ? Number(foundProjet.array_options.options_pourcentcapitaine) / 100 : 0
          return inv;
      })
      const paidInvoicesIndep = paidInvoices.filter(inv => structureProjetIds.indexOf(inv.fk_project) === -1);

      // Structure related
      const expensesStructure = supplierInvoices.filter(sinv => !sinv.isFreelance);
      const freelanceSupplierInvoices = supplierInvoices.filter(sinv => sinv.isFreelance);

      // stats
      const countFreelanceSupplierInvoices = freelanceSupplierInvoices.length;
      const countFreelanceWithSupplierInvoices = freelanceSupplierInvoices.map(sinv => sinv.fk_soc).filter((fk_soc, ind, arr) => arr.indexOf(fk_soc) === ind).length;

      // reel expense : total of supplier invoices linked to project with no percent to structure
      const reelTotalStructureExpenses = expensesStructure.reduce((total, inv) => {
        return total + inv.total_ht;
      }, 0);

      const projectsIncomeProjectedTotal = invoicesIndep.reduce((total,inv) => {
        return total + inv.total_ht;
      }, 0);
      const distributionProjectedCapitaine = Math.trunc(invoicesIndep
        .reduce((total,inv) => {
          return total + inv.total_ht*inv.pourcentcapitaine;
      }, 0));
      const distributionProjectedApportAffaire = Math.trunc(invoicesIndep
        .reduce((total,inv) => {
            return total + inv.total_ht*inv.pourcentapportaffaire;
        }, 0));
      const distributionProjectedBrand = Math.trunc(invoicesIndep
        .reduce((total,inv) => {
            return total + inv.total_ht*inv.pourcentmarquehd;
        }, 0));
      const celluleIncomeProjected = Math.trunc(invoicesIndep
        .reduce((total,inv) => {
          return total + inv.total_ht*inv.pourcentcellule;
      }, 0));
      const celluleIncomePaid = Math.trunc(paidInvoicesIndep
        .reduce((total,inv) => {
          return total + inv.total_ht*inv.pourcentcellule;
      }, 0));

      const distributionFreelancesTotal = projectsIncomeProjectedTotal - distributionProjectedCapitaine - distributionProjectedApportAffaire - distributionProjectedBrand - celluleIncomeProjected;
      const taxes = (celluleIncomePaid - reelTotalStructureExpenses) * 15.5 / 100;

      const verifyFreelanceDistributionWithSupplierInvoices = freelanceSupplierInvoices.reduce((total, inv) => {
        return total + inv.total_ht;
      }, 0)

      // for information
      if (distributionFreelancesTotal !== verifyFreelanceDistributionWithSupplierInvoices) {
        console.log(`Difference between sum distribution of freelances calculated with invoices : ${distributionFreelancesTotal} and with supplier invoices : ${verifyFreelanceDistributionWithSupplierInvoices} ⌛`)
        if (distributionFreelancesTotal < verifyFreelanceDistributionWithSupplierInvoices) {
          console.error(`Freelances have received money before the canums received it ! 🧨`)
        }
      }

      // structure expenses details
      const strutureExpensesDetails = {};
      Object.keys(structureExpensesThirdParties).forEach(exp => {
          strutureExpensesDetails[exp] = Math.trunc(
            expensesStructure.filter(
              inv => structureExpensesThirdParties[exp].indexOf(inv.fk_soc) !== -1
            ).reduce(
              (total, inv) => {
                return total + inv.total_ht;
              }, 0)
            );
        })

      // for verification
      const totalStructureExpenses = Object.values(strutureExpensesDetails).reduce((total:number, current:number) => {
        return total + current;
      }, 0);

      if (reelTotalStructureExpenses !== totalStructureExpenses) {
        console.error(`Something is missing in the ids of the expenses; real total expenses : ${reelTotalStructureExpenses} is different from the sum of all expenses : ${totalStructureExpenses} 🦊`)
      }

      const stats = {
          projectsIncome: {
            projected: {
              total: projectsIncomeProjectedTotal,
              invoiceCount: invoicesIndep.length
            },
            paid: {
              total: paidInvoices.reduce((total,inv) => {
                return total + inv.total_ht;
                }, 0),
              invoiceCount: paidInvoices.length
            },
            unpaid: {
              total: allInvoicesUnpaid.reduce((total, inv) => {
                return total + inv.total_ht;
              }, 0),
              invoiceCount: allInvoicesUnpaid.length
            }
          },
          distributionProjected: {
            capitaine: distributionProjectedCapitaine,
            apportAffaire: distributionProjectedApportAffaire,
            brand: distributionProjectedBrand,
            freelances: {
              total: distributionFreelancesTotal,
              countInvoices: countFreelanceSupplierInvoices,
              countFreelances: countFreelanceWithSupplierInvoices,
              averagePerFreelance: countFreelanceWithSupplierInvoices > 0 ? Math.trunc(distributionFreelancesTotal / countFreelanceWithSupplierInvoices) : 0
            }
          },
          structure : {
              income: {
                projected: celluleIncomeProjected,
                paid: celluleIncomePaid,
              },
              expenses: {
                reelTotal: reelTotalStructureExpenses,
                detail: strutureExpensesDetails
              },
              taxes: Math.trunc(taxes),
              realTreasury : Math.trunc(celluleIncomePaid - reelTotalStructureExpenses - taxes + ret[(year-1)].structure.realTreasury)
          }
      };
      ret[year] = stats;
    }
    console.log(ret)
    console.log(ret[2022])
    return ret;
}

export async function fetchProjects() {
    return mapProjects(await fetchApi("projects?sortfield=t.rowid&sortorder=ASC&limit=3000"));
}

export async function fetchThirdParties() {
    return mapThirdParties(await fetchApi("thirdparties?sortfield=t.rowid&sortorder=ASC&limit=3000"));
}

export async function fetchInvoices() {
    return mapInvoices(await fetchApi("invoices?sortfield=t.rowid&sortorder=ASC&limit=3000"));
}

export async function fetchSupplierInvoices() {
    return mapSupplierInvoices(await fetchApi("supplierinvoices?sortfield=t.rowid&sortorder=ASC&limit=3000"));
}


export function mapProjects(projects: projectApiInterface[]) : ProjectEntity[] {
    return projects.map((project) => new ProjectEntity(project))
}

export function mapInvoices(invoices: invoiceApiInterface[]) : InvoiceEntity[] {
    return invoices.map((invoice) => new InvoiceEntity(invoice))
}

export function mapSupplierInvoices(invoices: supplierInvoiceApiInterface[]) : SupplierInvoiceEntity[] {
    return invoices.map((invoice) => new SupplierInvoiceEntity(invoice))
}

export function mapThirdParties(invoices: thirdPartieInterface[]) : ThirdPartieEntity[] {
    return invoices.map((invoice) => new ThirdPartieEntity(invoice))
}
