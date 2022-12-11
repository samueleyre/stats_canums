import {projectApiInterface} from "../interfaces/project.interface";
import {ProjectEntity} from "../entities/project.entity";
import {moneyStatsInterface} from "../interfaces/stats.interface";
import {InvoiceEntity} from "../entities/invoice.entity";
import {invoiceApiInterface} from "../interfaces/invoice.interface";
import {structureProjetIds, structureProjets, structureThirdParties, structureThirdPartiesIds} from "@/lib/const";
import {SupplierInvoiceEntity} from "../entities/supplierInvoice.entity";
import {supplierInvoiceApiInterface} from "../interfaces/supplierInvoice.interface";

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
    const projets = await fetchProjects();

    const ret = {};
    for (let year of process.env.YEARS.split(",").map(Number)) {

      const invoices = await fetchInvoicesByYear(year);
      const supplierInvoices = await fetchSupplierInvoicesByYear(year);

      const invoicesIndep = invoices.filter(inv => structureProjetIds.indexOf(inv.fk_project) === -1);
      const invoicesStructure = invoices.filter(inv => structureProjetIds.indexOf(inv.fk_project) !== -1);
      const spendingStructure = supplierInvoices.filter(sinv => structureThirdPartiesIds.indexOf(sinv.fk_soc) !== -1);

      // complete invoices
      invoicesIndep.map((inv) => {
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

      const stats = {
          projectsIncome: invoicesIndep
            .reduce((total,inv) => {
              return total + inv.total_ht;
          }, 0),
          capitaineIncome: Math.trunc(invoicesIndep
            .reduce((total,inv) => {
              return total + inv.total_ht*inv.pourcentcapitaine;
          }, 0)),
          celluleIncome: Math.trunc(invoicesIndep
            .reduce((total,inv) => {
                return total + inv.total_ht*inv.pourcentcellule;
            }, 0)),
          apportAffaireIncome: Math.trunc(invoicesIndep
            .reduce((total,inv) => {
                return total + inv.total_ht*inv.pourcentapportaffaire;
            }, 0)),
          brandIncome: Math.trunc(invoicesIndep
            .reduce((total,inv) => {
                return total + inv.total_ht*inv.pourcentmarquehd;
            }, 0)),
          structureDetails : {
              // communityManagement: Math.trunc(invoicesStructure.filter(inv => inv.fk_project === structureProjets.communityManagementProjet).reduce((total, inv) => {
              //     return total + inv.total_ht;
              // }, 0)),
              // coworking: Math.trunc(invoicesStructure.filter(inv => inv.fk_project === structureProjets.coworking2021Projet).reduce((total, inv) => {
              //     return total + inv.total_ht;
              // }, 0)),
              // newsletter: Math.trunc(invoicesStructure.filter(inv => inv.fk_project === structureProjets.newsletter2020Projet).reduce((total, inv) => {
              //     return total + inv.total_ht;
              // }, 0)),
              // fonctionnement: Math.trunc(invoicesStructure.filter(inv => inv.fk_project === structureProjets.fonctionnement2020Projet || inv.fk_project === structureProjets.fonctionnement2021Projet).reduce((total, inv) => {
              //     return total + inv.total_ht;
              // }, 0)),
              banque: Math.trunc(spendingStructure.filter(inv => inv.fk_soc === structureThirdParties.banque).reduce((total, inv) => {
                  return total + inv.total_ht;
              }, 0)),
              maif: Math.trunc(spendingStructure.filter(inv => inv.fk_soc === structureThirdParties.maif).reduce((total, inv) => {
                  return total + inv.total_ht;
              }, 0)),
              hd: Math.trunc(spendingStructure.filter(inv => inv.fk_soc === structureThirdParties.hd).reduce((total, inv) => {
                  return total + inv.total_ht;
              }, 0)),
              hdParis: Math.trunc(spendingStructure.filter(inv => inv.fk_soc === structureThirdParties.hdParis).reduce((total, inv) => {
                  return total + inv.total_ht;
              }, 0)),
              communication: Math.trunc(spendingStructure.filter(inv => inv.fk_soc === structureThirdParties.communication).reduce((total, inv) => {
                  return total + inv.total_ht;
              }, 0)),
              visio: Math.trunc(spendingStructure.filter(inv => inv.fk_soc === structureThirdParties.visio).reduce((total, inv) => {
                  return total + inv.total_ht;
              }, 0)),
              coworking: Math.trunc(spendingStructure.filter(inv => inv.fk_soc === structureThirdParties.coworking).reduce((total, inv) => {
                  return total + inv.total_ht;
              }, 0)),
          }
      };
      ret[year] = {
          ...stats,
          indepIncome: stats.projectsIncome - stats.celluleIncome - stats.capitaineIncome - stats.apportAffaireIncome - stats.brandIncome
      }
    }
    console.log(ret)
    return ret;
}

export async function fetchProjects() {
    return mapProjects(await fetchApi("projects?sortfield=t.rowid&sortorder=ASC&limit=100"));
}

export async function fetchInvoicesByYear(year) {
    return mapInvoices(
      await fetchApi("invoices?sortfield=t.rowid&sortorder=ASC&limit=100"),
      year
    );
}

export async function fetchSupplierInvoicesByYear(year) {
    return mapSupplierInvoices(
      await fetchApi("supplierinvoices?sortfield=t.rowid&sortorder=ASC&limit=100"),
      year
    );
}

export function mapProjects(projects: projectApiInterface[]) : ProjectEntity[] {
    return projects.map((project) => new ProjectEntity(project))
}

export function mapInvoices(
  invoices: invoiceApiInterface[],
  year: number
) : InvoiceEntity[] {
    return invoices.map((invoice) => new InvoiceEntity(invoice)).filter(inv=> inv.paye === "1" && inv.creation_year === year)
}

export function mapSupplierInvoices(
  invoices: supplierInvoiceApiInterface[],
  year: number
) : SupplierInvoiceEntity[] {
    return invoices.map((invoice) => new SupplierInvoiceEntity(invoice)).filter(inv=> inv.paid === "1" && inv.creation_year === year)
}
