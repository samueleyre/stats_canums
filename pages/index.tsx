import Head from 'next/head'
import styles from '@/styles/Home.module.scss'
import {getStats} from "../lib/api";
import {moneyStatsInterface} from "../interfaces/stats.interface";
import {Component} from "react";



export default class Home extends Component {

  constructor({ allStats }: { allStats : {[key: int]: moneyStatsInterface} }) {
      super({ allStats });
      const year = new Date().getFullYear()
      this.years = Object.keys(allStats).map((year) => Number(year));
      console.log(this.years)
      this.allStats = allStats;
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
            {this.years.map((year_it, index) =>
              <button className={`year ${(year === year_it )? "selected" : "" }`} data-year={year_it} onClick={() => this.changeDate(year_it)}>{year_it}</button>
            )}
          </div>
          <div className={styles.statContainer}>
            <div className={styles.stat}>
              <p className={styles.statTitle}>Chiffre d'affaire</p>
              <p className={styles.statNumber}>{allStatsInYear.projectsIncome}</p>
            </div>
          </div>
          <h2>Où va l'argent ?</h2>
          <div className={styles.statContainer}>
            <div className={styles.stat}>
              <p className={styles.statTitle}>Les indépendants</p>
              <p className={styles.statNumber}>{allStatsInYear.indepIncome}</p>
            </div>
            <div className={styles.stat}>
              <p className={styles.statTitle}>La cellule lyonnaise</p>
              <p className={styles.statNumber}>{allStatsInYear.celluleIncome}</p>
            </div>
            <div className={styles.stat}>
              <p className={styles.statTitle}>Les Capitaines</p>
              <p className={styles.statNumber}>{allStatsInYear.capitaineIncome}</p>
            </div>
            <div className={styles.stat}>
              <p className={styles.statTitle}>Les apporteurs d'affaires</p>
              <p className={styles.statNumber}>{allStatsInYear.apportAffaireIncome}</p>
            </div>
            <div className={styles.stat}>
              <p className={styles.statTitle}>La marque Happy Dev</p>
              <p className={styles.statNumber}>{allStatsInYear.brandIncome}</p>
            </div>
          </div>
          <h2>Les dépenses de la structure</h2>
          <div className={styles.statContainer}>
            {
              allStatsInYear.structureDetails.coworking ?
                <div className={styles.stat}>
                  <p className={styles.statTitle}>Bureaux</p>
                  <p className={styles.statNumber}>{allStatsInYear.structureDetails.coworking}</p>
                </div> : ""
            }
            {
              allStatsInYear.structureDetails.banque ?
                <div className={styles.stat}>
                  <p className={styles.statTitle}>Banque</p>
                  <p className={styles.statNumber}>{allStatsInYear.structureDetails.banque}</p>
                </div> : ""
            }
            {
              allStatsInYear.structureDetails.maif ?
                <div className={styles.stat}>
                  <p className={styles.statTitle}>Assurance</p>
                  <p className={styles.statNumber}>{allStatsInYear.structureDetails.maif}</p>
                </div> : ""
            }
            {
              allStatsInYear.structureDetails.visio ?
                <div className={styles.stat}>
                  <p className={styles.statTitle}>Outil de visio</p>
                  <p className={styles.statNumber}>{allStatsInYear.structureDetails.visio}</p>
                </div> : ""
            }
            {
              allStatsInYear.structureDetails.communication ?
                <div className={styles.stat}>
                  <p className={styles.statTitle}>Communication</p>
                  <p className={styles.statNumber}>{allStatsInYear.structureDetails.communication}</p>
                </div> : ""
            }
            {
              allStatsInYear.structureDetails.coworking ?
                <div className={styles.stat}>
                  <p className={styles.statTitle}>Bureaux</p>
                  <p className={styles.statNumber}>{allStatsInYear.structureDetails.coworking}</p>
                </div> : ""
            }
            {/*{*/}
            {/*  allStatsInYear.structureDetails.communityManagement ?*/}
            {/*    <div className={styles.stat}>*/}
            {/*      <p className={styles.statTitle}>Community Management du coworking</p>*/}
            {/*      <p className={styles.statNumber}>{allStatsInYear.structureDetails.communityManagement}</p>*/}
            {/*    </div> : ""*/}
            {/*}*/}
            {/*{*/}
            {/*  allStatsInYear.structureDetails.coworking ?*/}
            {/*    <div className={styles.stat}>*/}
            {/*      <p className={styles.statTitle}>Frais de bureau</p>*/}
            {/*      <p className={styles.statNumber}>{allStatsInYear.structureDetails.coworking}</p>*/}
            {/*    </div> : ""*/}
            {/*}*/}
            {/*{*/}
            {/*  allStatsInYear.structureDetails.fonctionnement ?*/}
            {/*    <div className={styles.stat}>*/}
            {/*      <p className={styles.statTitle}>Frais de fonctionnement</p>*/}
            {/*      <p className={styles.statNumber}>{allStatsInYear.structureDetails.fonctionnement}</p>*/}
            {/*    </div> : ""*/}
            {/*}*/}
            {/*{*/}
            {/*  allStatsInYear.structureDetails.newsletter ?*/}
            {/*    <div className={styles.stat}>*/}
            {/*      <p className={styles.statTitle}>Newsletter</p>*/}
            {/*      <p className={styles.statNumber}>{allStatsInYear.structureDetails.newsletter}</p>*/}
            {/*    </div> : ""*/}
            {/*}*/}
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
