import Head from 'next/head'
import styles from '@/styles/Home.module.scss'
import {getStats} from "../lib/api";
import {moneyStatsInterface} from "../interfaces/stats.interface";

export default function Home({ allStats }: { allStats : moneyStatsInterface }) {
  console.log({ allStats })

  return (
    <div className={styles.container}>
      <Head>
        <title>Canums stats</title>
        <meta name="description" content="Canums devient transparent !" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.mainTitle}>
          Les Canumériques en 2021
        </h1>
        <div className={styles.statContainer}>
          <div className={styles.stat}>
            <p className={styles.statTitle}>Chiffre d'affaire</p>
            <p className={styles.statNumber}>{allStats.projectsIncome}</p>
          </div>
        </div>
        <h2>Où va l'argent ?</h2>
        <div className={styles.statContainer}>
          <div className={styles.stat}>
            <p className={styles.statTitle}>Les indépendants</p>
            <p className={styles.statNumber}>{allStats.indepIncome}</p>
          </div>
          <div className={styles.stat}>
            <p className={styles.statTitle}>La cellule lyonnaise</p>
            <p className={styles.statNumber}>{allStats.celluleIncome}</p>
          </div>
          <div className={styles.stat}>
            <p className={styles.statTitle}>Les Capitaines</p>
            <p className={styles.statNumber}>{allStats.capitaineIncome}</p>
          </div>
          <div className={styles.stat}>
            <p className={styles.statTitle}>Les apporteurs d'affaires</p>
            <p className={styles.statNumber}>{allStats.apportAffaireIncome}</p>
          </div>
          <div className={styles.stat}>
            <p className={styles.statTitle}>La marque Happy Dev</p>
            <p className={styles.statNumber}>{allStats.brandIncome}</p>
          </div>
        </div>
        <h2>Les dépenses de la structure</h2>
        <div className={styles.statContainer}>
          {
            allStats.structureDetails.coworking ?
              <div className={styles.stat}>
                <p className={styles.statTitle}>Bureaux</p>
                <p className={styles.statNumber}>{allStats.structureDetails.coworking}</p>
              </div> : ""
          }
          {
            allStats.structureDetails.banque ?
              <div className={styles.stat}>
                <p className={styles.statTitle}>Banque</p>
                <p className={styles.statNumber}>{allStats.structureDetails.banque}</p>
              </div> : ""
          }
          {
            allStats.structureDetails.maif ?
              <div className={styles.stat}>
                <p className={styles.statTitle}>Assurance</p>
                <p className={styles.statNumber}>{allStats.structureDetails.maif}</p>
              </div> : ""
          }
          {
            allStats.structureDetails.visio ?
              <div className={styles.stat}>
                <p className={styles.statTitle}>Outil de visio</p>
                <p className={styles.statNumber}>{allStats.structureDetails.visio}</p>
              </div> : ""
          }
          {
            allStats.structureDetails.communication ?
              <div className={styles.stat}>
                <p className={styles.statTitle}>Communication</p>
                <p className={styles.statNumber}>{allStats.structureDetails.communication}</p>
              </div> : ""
          }
          {
            allStats.structureDetails.coworking ?
              <div className={styles.stat}>
                <p className={styles.statTitle}>Bureaux</p>
                <p className={styles.statNumber}>{allStats.structureDetails.coworking}</p>
              </div> : ""
          }
          {/*{*/}
          {/*  allStats.structureDetails.communityManagement ?*/}
          {/*    <div className={styles.stat}>*/}
          {/*      <p className={styles.statTitle}>Community Management du coworking</p>*/}
          {/*      <p className={styles.statNumber}>{allStats.structureDetails.communityManagement}</p>*/}
          {/*    </div> : ""*/}
          {/*}*/}
          {/*{*/}
          {/*  allStats.structureDetails.coworking ?*/}
          {/*    <div className={styles.stat}>*/}
          {/*      <p className={styles.statTitle}>Frais de bureau</p>*/}
          {/*      <p className={styles.statNumber}>{allStats.structureDetails.coworking}</p>*/}
          {/*    </div> : ""*/}
          {/*}*/}
          {/*{*/}
          {/*  allStats.structureDetails.fonctionnement ?*/}
          {/*    <div className={styles.stat}>*/}
          {/*      <p className={styles.statTitle}>Frais de fonctionnement</p>*/}
          {/*      <p className={styles.statNumber}>{allStats.structureDetails.fonctionnement}</p>*/}
          {/*    </div> : ""*/}
          {/*}*/}
          {/*{*/}
          {/*  allStats.structureDetails.newsletter ?*/}
          {/*    <div className={styles.stat}>*/}
          {/*      <p className={styles.statTitle}>Newsletter</p>*/}
          {/*      <p className={styles.statNumber}>{allStats.structureDetails.newsletter}</p>*/}
          {/*    </div> : ""*/}
          {/*}*/}
        </div>


      </main>
    </div>
  )
}

export async function getStaticProps() {
    return {
        props: { allStats: await getStats() || [] },
    }
}
