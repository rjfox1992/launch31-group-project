import { connection } from "../boot.js"
import genreSeeder from "./seeders/genreSeeder.js"
class Seeder {
  static async seed() {
    console.log("seeding Genres")
    await genreSeeder.seed()

    console.log("Done!")
    await connection.destroy()
  }
}

export default Seeder
