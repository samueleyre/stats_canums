import {thirdPartieInterface} from "../interfaces/thirdPartie.interface";

export class ThirdPartieEntity {
  id: string
  typent_code: "TE_MEDIUM" | "TE_SMALL" | "TE_FREELANCE" | "TE_ADMIN" | "TE_OTHER"
  name: string
  name_alias: string

  constructor(object: thirdPartieInterface) {

    if ('id' in object) {
      this.id = object.id;
    }
    if ('name' in object) {
      this.name = object.name;
    }
    if ('name_alias' in object) {
      this.name_alias = object.name_alias;
    }
    if ('typent_code' in object) {
      this.typent_code = object.typent_code;
    }
  }
}
