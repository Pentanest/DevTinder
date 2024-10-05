const { MongoClient } = require("mongodb");

const URI = "mongodb+srv://admin-shubhankar:Shubho123@cluster0.bvdhz.mongodb.net/";
const client = new MongoClient(URI);

const dbName = "HelloWorld";

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const collection = db.collection("User");

  const data = {
    firstName: "Yashika",
    lastName: "Gupta",
    city: "Delhi",
    phoneNumber: "1234567890",
  };

  //   const insertResult = await collection.insertOne(data);
  //   console.log("Inserted documents =>", insertResult);

  //   const updateResult = await collection.updateOne({ firstName: "Shubhankar" }, { $set: { city: "Kolkata" } });
  //   console.log("Updated documents =>", updateResult);

  //   const deleteResult = await collection.deleteOne({ city: "Delhi" });
  //   console.log("Deleted documents =>", deleteResult);

  const findResult = await collection.countDocuments();
  console.log("Found documents =>", findResult);

  const countResult = await collection.countDocuments();
  console.log("count =>", countResult);

  return "done.";
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
