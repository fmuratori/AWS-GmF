import DonationModel from '../models/donationModel';
import EventModel from '../models/eventModel';
import FamilyModel from '../models/familyModel';
import FoodModel from '../models/foodModel';
import PackModel from '../models/packModel';
import UserModel from '../models/userModel';
import fs from "fs"

export default class ExportManager {

  exportAll = () => {
    this.exportUserCollection()
    this.exportPackCollection()
    this.exportFoodCollection()
    this.exportEventCollection()
    this.exportFamilyCollection()
    this.exportDonationCollection()
  }

  exportUserCollection = () => {
    UserModel.find().select("+hashPassword")
      .then((data) => this.save("users", data))
  }

  exportPackCollection = () => {
    PackModel.find()
      .then((data) => this.save("packs", data))
  }

  exportFoodCollection = () => {
    FoodModel.find()
      .then((data) => this.save("foods", data))
  }

  exportEventCollection = () => {
    EventModel.find()
      .then((data) => this.save("events", data))
  }

  exportFamilyCollection = () => {
    FamilyModel.find()
      .then((data) => this.save("families", data))
  }

  exportDonationCollection = () => {
    DonationModel.find().select("+chat")
      .then((data) => this.save("donations", data))
  }

  private save = (fileName: string, data: any) => {
    const rawdata = JSON.stringify(data)
    const filePath = __dirname + '/../../data/' + fileName + '.json'
    fs.writeFileSync(filePath, rawdata)
  }
}
