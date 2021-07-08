import {projectApiInterface} from "../interfaces/project.interface";
import {ProjectEntity} from "../entities/project.entity";
import {moneyStatsInterface} from "../interfaces/stats.interface";
import {InvoiceEntity} from "../entities/invoice.entity";
import {invoiceApiInterface} from "../interfaces/invoice.interface";

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

const communityManagementProjet = {
    id: "22",
    title: "Community Management Tuba"
}
const coworking2021Projet = {
    id: "57",
    title: "Coworking"
}
const newsletter2020Projet = {
    id: "23",
    title: "Newsletter 2020"
}
const fonctionnement2020Projet = {
    id: "24",
    title: "Fonctionnement"
}
const fonctionnement2021Projet = {
    id: "58",
    title: "Fonctionnement"
}

const structureProjetIds = [
  communityManagementProjet.id,
  coworking2021Projet.id,
  newsletter2020Projet.id,
  fonctionnement2020Projet.id,
  fonctionnement2021Projet.id,
]

export async function getStats(): Promise<moneyStatsInterface> {
    const projets = await fetchProjects();
    const invoices = await fetchInvoices();

    const invoicesIndep = invoices.filter(inv => structureProjetIds.indexOf(inv.fk_project) === -1);
    const invoicesStructure = invoices.filter(inv => structureProjetIds.indexOf(inv.fk_project) !== -1);

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
            communityManagement: Math.trunc(invoicesStructure.filter(inv => inv.fk_project === communityManagementProjet.id).reduce((total, inv) => {
                return total + inv.total_ht;
            }, 0)),
            coworking: Math.trunc(invoicesStructure.filter(inv => inv.fk_project === coworking2021Projet.id).reduce((total, inv) => {
                return total + inv.total_ht;
            }, 0)),
            newsletter: Math.trunc(invoicesStructure.filter(inv => inv.fk_project === newsletter2020Projet.id).reduce((total, inv) => {
                return total + inv.total_ht;
            }, 0)),
            fonctionnement: Math.trunc(invoicesStructure.filter(inv => inv.fk_project === fonctionnement2020Projet.id || inv.fk_project === fonctionnement2021Projet.id).reduce((total, inv) => {
                return total + inv.total_ht;
            }, 0)),
        }
    };
    return {
        ...stats,
        indepIncome: stats.projectsIncome - stats.celluleIncome - stats.capitaineIncome - stats.apportAffaireIncome - stats.brandIncome
    }
}

export async function fetchProjects() {
    return mapProjects(await fetchApi("projects?sortfield=t.rowid&sortorder=ASC&limit=100"));
}

export async function fetchInvoices() {
    return mapInvoices(await fetchApi("invoices?sortfield=t.rowid&sortorder=ASC&limit=100"));
}

export function mapProjects(projects: projectApiInterface[]) : ProjectEntity[] {
    return projects.map((project) => new ProjectEntity(project))
}

export function mapInvoices(invoices: invoiceApiInterface[]) : InvoiceEntity[] {
    return invoices.map((invoice) => new InvoiceEntity(invoice)).filter(inv=> inv.paye === "1" && inv.creation_year === Number(process.env.YEAR))
}
