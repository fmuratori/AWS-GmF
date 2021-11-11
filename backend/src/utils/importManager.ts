import DonationModel from '../models/donationModel';
import EventModel from '../models/eventModel';
import FamilyModel from '../models/familyModel';
import FoodModel from '../models/foodModel';
import PackModel from '../models/packModel';
import UserModel from '../models/userModel';
import fs from "fs"
import mongoose from 'mongoose';

export default class ImportManager {

  importAll = () => {
    this.importUserCollection()
    this.importPackCollection()
    this.importFoodCollection()
    this.importEventCollection()
    this.importFamilyCollection()
    this.importDonationCollection()
  }

  importUserCollection = () => UserModel.insertMany(this.load("users"))

  importPackCollection = () => PackModel.insertMany(this.load("packs"))

  importFoodCollection = () => FoodModel.insertMany(this.load("foods"))

  importEventCollection = () => EventModel.insertMany(this.load("events"))

  importFamilyCollection = () => FamilyModel.insertMany(this.load("families"))

  importDonationCollection = () => DonationModel.insertMany(this.load("donations"))

  private load = (collectionName: string): any => {
    mongoose.connection.db.dropCollection(collectionName)

    const fileName = __dirname + '/../../data/' + collectionName + '.json'
    const rawdata = fs.readFileSync(fileName).toString()

    return JSON.parse(rawdata)
  }
}
