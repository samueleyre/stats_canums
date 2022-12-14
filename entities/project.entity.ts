import {projectApiInterface} from "../interfaces/project.interface";

export class ProjectEntity {
  id: string
  title: string
  creation_year: number
  date_c: number
  date_m: number
  date_start: number
  date_validation: null
  description: string;
  opp_amount: null
  opp_percent: string
  opp_status: string
  socid: string // third partie id (client)
  array_options: {
    options_pourcentcapitaine: string,
    options_pourcentmarquehd: string,
    options_pourcentapportaffaire: string,
    options_pourcentcellule: string
  }
  constructor(object: projectApiInterface) {
    if ('id' in object) {
      this.id = object.id;
    }
    if ('title' in object) {
      this.title = object.title;
    }
    if ('date_c' in object) {
      this.date_c = object.date_c;
      this.creation_year = (new Date(object.date_c*1000)).getFullYear();
    }
    if ('date_m' in object) {
      this.date_m = object.date_m;
    }
    if ('date_start' in object) {
      this.date_start = object.date_start;
    }
    if ('date_validation' in object) {
      this.date_validation = object.date_validation;
    }
    if ('description' in object) {
      this.description = object.description;
    }
    if ('opp_amount' in object) {
      this.opp_amount = object.opp_amount;
    }
    if ('opp_percent' in object) {
      this.opp_percent = object.opp_percent;
    }
    if ('opp_status' in object) {
      this.opp_status = object.opp_status;
    }
    if ('socid' in object) {
      this.socid = object.socid;
    }
    if ('array_options' in object) {
      this.array_options = object.array_options;
    }
  }
}
