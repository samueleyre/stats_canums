import Head from 'next/head'
import styles from '@/styles/Home.module.scss'
import {getStats} from "../lib/api";
import {moneyStatsInterface} from "../interfaces/stats.interface";
import {Component} from "react";



export default class Home extends Component<{}, {year: number, allStatsInYear: moneyStatsInterface}> {

  years;
  allStats;
  currentYear;

  constructor({ allStats }: { allStats : {[key: number]: moneyStatsInterface} }) {
      super({ allStats });
      const year = new Date().getFullYear()
      this.years = Object.keys(allStats).map((year) => Number(year));
      this.allStats = allStats;
      this.currentYear = year;
      this.state = {
        year,
        allStatsInYear : allStats[year]
      };
  }

  changeDate = (year) => {
    Array.from(document.getElementsByClassName("year")).forEach(element => {
      if (Number(element.getAttribute("data-year")) === year) {
        element.classList.add("selected");

      } else {
        element.classList.remove("selected");
      }
    });
    this.setState(
      {
        year,
        allStatsInYear : this.allStats[year]
      }
    );
  }

  render() {

    const {allStatsInYear, year} = this.state;

    return (
      <div className={styles.container}>
        <Head>
          <title>Canums stats</title>
          <meta name="description" content="Canums devient transparent !" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <h1 className={styles.mainTitle} >
            Les Canumériques en chiffres
          </h1>
          <div className={styles.yearsContainer} >
            {
              this.years.map((year_it, index) => {
                if (year_it > 2020) { // todo: this should be in env
                  return <button className={`year ${(year === year_it )? "selected" : "" }`} data-year={year_it} onClick={() => this.changeDate(year_it)}>{year_it}</button>
                }
              })
            }
          </div>
          <h2>Revenus</h2>
          <div className={styles.statContainer}>
            {
              year === this.currentYear ?
              <div className={styles.stat}>
                <p className={styles.statTitle}>Chiffre d'affaire prévisionnel </p>
                <p className={styles.statNumber}>{allStatsInYear.projectsIncome.projected.total}</p>
                <p className={styles.statNumber}>{allStatsInYear.projectsIncome.projected.invoiceCount} factures</p>
              </div> : ""
            }
            {
              year <= this.currentYear ?
              <div className={styles.stat}>
                <p className={styles.statTitle}>Chiffre d'affaire encaissé </p>
                <p className={styles.statNumber}>{allStatsInYear.projectsIncome.paid.total}</p>
                <p className={styles.statNumber}>{allStatsInYear.projectsIncome.paid.invoiceCount} factures</p>
              </div> : ""
            }
            {
              year >= this.currentYear ?
              <div className={styles.stat}>
                <p className={styles.statTitle}>En attente de paiement</p>
                <p className={styles.statNumber}>{allStatsInYear.projectsIncome.unpaid.total}</p>
                <p className={styles.statNumber}>{allStatsInYear.projectsIncome.unpaid.invoiceCount} factures</p>
              </div> : ""
            }
          </div>
          <h2>Distribution</h2>
          <div className={styles.statContainer}>
            <div className={styles.stat}>
              <p className={styles.statTitle}>Les Capitaines</p>
              <p className={styles.statNumber}>{allStatsInYear.distributionProjected.capitaine}</p>
            </div>
            <div className={styles.stat}>
              <p className={styles.statTitle}>Les apporteurs d'affaires</p>
              <p className={styles.statNumber}>{allStatsInYear.distributionProjected.apportAffaire}</p>
            </div>
            <div className={styles.stat}>
              <p className={styles.statTitle}>La marque Happy Dev</p>
              <p className={styles.statNumber}>{allStatsInYear.distributionProjected.brand}</p>
            </div>
          </div>
          <h3>Les indépendants</h3>
          <div className={styles.statContainer}>
            <div className={styles.stat}>
              <p className={styles.statTitle}>Chiffre d'affaire prévisionnel</p>
              <p className={styles.statNumber}>{allStatsInYear.distributionProjected.freelances.total}</p>
            </div>
            <div className={styles.stat}>
              <p className={styles.statTitle}>Nombre de factures concernées</p>
              <p className={styles.statNumber}>{allStatsInYear.distributionProjected.freelances.countInvoices}</p>
            </div>
            <div className={styles.stat}>
              <p className={styles.statTitle}>Nombre de freelances concernés</p>
              <p className={styles.statNumber}>{allStatsInYear.distributionProjected.freelances.countFreelances}</p>
            </div>
            <div className={styles.stat}>
              <p className={styles.statTitle}>Revenu moyen du freelance</p>
              <p className={styles.statNumber}>{allStatsInYear.distributionProjected.freelances.averagePerFreelance}</p>
            </div>

          </div>

          <h2>Les canumériques</h2>
          <div className={styles.statContainer}>
          {
            year <= this.currentYear ?
              <div className={styles.stat}>
                <p className={styles.statTitle}>Revenus prévisionnel</p>
                <p className={styles.statNumber}>{allStatsInYear.structure.income.projected}</p>
              </div> : ""
          }
          {
            year > this.currentYear ?
            <div className={styles.stat}>
              <p className={styles.statTitle}>Revenus encaissés</p>
              <p className={styles.statNumber}>{allStatsInYear.structure.income.paid}</p>
            </div> : ""
          }
          </div>
          <h3>Charges réelles</h3>
          <div className={styles.statContainer}>
            <div className={styles.stat}>
              <p className={styles.statTitle}>Total</p>
              <p className={styles.statNumber}>{allStatsInYear.structure.expenses.reelTotal}</p>
            </div>

            {
              allStatsInYear.structure.expenses.detail.bureau ?
                <div className={styles.stat}>
                  <p className={styles.statTitle}>Bureaux</p>
                  <p className={styles.statNumber}>{allStatsInYear.structure.expenses.detail.bureau}</p>
                </div> : ""
            }
            {
              allStatsInYear.structure.expenses.detail.banque ?
                <div className={styles.stat}>
                  <p className={styles.statTitle}>Banque</p>
                  <p className={styles.statNumber}>{allStatsInYear.structure.expenses.detail.banque}</p>
                </div> : ""
            }
            {
              allStatsInYear.structure.expenses.detail.assurance ?
                <div className={styles.stat}>
                  <p className={styles.statTitle}>Assurance</p>
                  <p className={styles.statNumber}>{allStatsInYear.structure.expenses.detail.assurance}</p>
                </div> : ""
            }
            {
              allStatsInYear.structure.expenses.detail.outils_numeriques ?
                <div className={styles.stat}>
                  <p className={styles.statTitle}>Outils numériques</p>
                  <p className={styles.statNumber}>{allStatsInYear.structure.expenses.detail.outils_numeriques}</p>
                </div> : ""
            }
            {
              allStatsInYear.structure.expenses.detail.communication ?
                <div className={styles.stat}>
                  <p className={styles.statTitle}>Communication</p>
                  <p className={styles.statNumber}>{allStatsInYear.structure.expenses.detail.communication}</p>
                </div> : ""
            }
            {
              allStatsInYear.structure.expenses.detail.materiel ?
                <div className={styles.stat}>
                  <p className={styles.statTitle}>Matériel</p>
                  <p className={styles.statNumber}>{allStatsInYear.structure.expenses.detail.materiel}</p>
                </div> : ""
            }
            {
              allStatsInYear.structure.expenses.detail.restauration ?
                <div className={styles.stat}>
                  <p className={styles.statTitle}>Restauration</p>
                  <p className={styles.statNumber}>{allStatsInYear.structure.expenses.detail.restauration}</p>
                </div> : ""
            }
            {
              allStatsInYear.structure.expenses.detail.team_building ?
                <div className={styles.stat}>
                  <p className={styles.statTitle}>Team building</p>
                  <p className={styles.statNumber}>{allStatsInYear.structure.expenses.detail.team_building}</p>
                </div> : ""
            }
            {
              allStatsInYear.structure.expenses.detail.facilitation ?
                <div className={styles.stat}>
                  <p className={styles.statTitle}>Facilitation</p>
                  <p className={styles.statNumber}>{allStatsInYear.structure.expenses.detail.facilitation}</p>
                </div> : ""
            }
            {
              allStatsInYear.structure.expenses.detail.comptable ?
                <div className={styles.stat}>
                  <p className={styles.statTitle}>Comptabilité</p>
                  <p className={styles.statNumber}>{allStatsInYear.structure.expenses.detail.comptable}</p>
                </div> : ""
            }
          </div>
          <h3>Taxes</h3>
          <div className={styles.statContainer}>
            <div className={styles.stat}>
              <p className={styles.statTitle}>Total</p>
              <p className={styles.statNumber}>{allStatsInYear.structure.taxes}</p>
            </div>
          </div>
          <h3>Trésorerie Réelle</h3>
          <div className={styles.statContainer}>
            <div className={styles.stat}>
              <p className={styles.statTitle}>Total</p>
              <p className={styles.statNumber}>{allStatsInYear.structure.realTreasury}</p>
            </div>
          </div>


        </main>
      </div>
    )
  }
}

export async function getStaticProps() {
    return {
        props: { allStats: await getStats() || [] },
    }
}
