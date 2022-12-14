
export const structureProjets = { // this is old
  communityManagementProjet: "22",
  coworking2021Projet: "57",
  newsletter2020Projet: "23",
  fonctionnement2020Projet: "24",
  fonctionnement2021Projet: "58"
}

export const structureProjetIds = Object.values(structureProjets);


export const structureThirdParties = {
  serveurs_coreus: "70",
  restauration: "21",
  serveurs_gandi: "127",
  banque: "22",
  maif: "25",
  communication_caroline: "20",
  visio_zoom: "38",
  serveurs_weedo: "39",
  coworking: "66",
  veolys: "140",
  trading: "144",
  shenzhenshij_achatenligne: "145",
  amazon: "146",
  ikea: "147",
  cacao_tricart: "134",
  pro_jex: "143",
  wakeup_escapegame: "150",
  materiel: "153",
}

export const structureExpensesThirdParties = {
  "banque" : [structureThirdParties.banque],
  "assurance" : [structureThirdParties.maif],
  "communication" : [structureThirdParties.communication_caroline],
  "outils_numeriques" : [structureThirdParties.serveurs_gandi, structureThirdParties.serveurs_gandi, structureThirdParties.serveurs_weedo, structureThirdParties.serveurs_coreus, structureThirdParties.visio_zoom],
  "materiel" : [structureThirdParties.amazon, structureThirdParties.materiel, structureThirdParties.pro_jex, structureThirdParties.shenzhenshij_achatenligne],
  "restauration" : [structureThirdParties.restauration],
  "team_building" : [structureThirdParties.wakeup_escapegame],
  "facilitation" : [structureThirdParties.cacao_tricart],
  "bureau" : [structureThirdParties.coworking],
  "trading" : [structureThirdParties.trading],
  "conseil": [structureThirdParties.veolys]
}

export const structureThirdPartiesIds = Object.values(structureThirdParties);

export const treasury2020 = 0;
