import express from "express"; // to set up our server
import mongoose from "mongoose"; // to connect to out mongodb database
import messages from "./messages.js"; // importing the messages collection schema
import Pusher from "pusher"; //pusher to get live updates in the database
import cors from "cors";
import users from "./users.js"; // users schema
import bcrypt from "bcryptjs"; // to compare passwords

const app = express();
const port = process.env.PORT || 9000;

const uri =
  "mongodb+srv://admin:ktr4hvXCFNcUnPdu@cluster0.zjpsi.mongodb.net/whatsappMONGO?retryWrites=true&w=majority";

mongoose.connect(uri); // connecting to the database

app.use(express.json());
app.use(cors());

const db = mongoose.connection; // need to make a reference to the connection of the database

db.once("open", () => {
  //once the db is open
  console.log("db is connected");
  const msgCollection = db.collection("messagecontents"); // needs to be the same name of our collection
  // need a reference to the collection that we wanna have a live update from
  const changeStream = msgCollection.watch();
  // reference to see if the collection has  changed

  changeStream.on("change", (change) => {
    // on change
    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      // we get the reference to the data that has been inserted to the db, stored in fulldocument
      pusher.trigger("messages", "inserted", {
        // we trigger pusher on messages inserted
        // we will be able to see this variables on the pusher console
        name: messageDetails.name,
        message: messageDetails.message,
      });
    } else {
      console.log("error ocurred");
    }
  });
});

const pusher = new Pusher({
  //the pusher config that we get when we create a new app in pusher
  appId: "1271157",
  key: "88b1a2c5a3cd9922487d",
  secret: "136ec9ec006bf5dd3458",
  cluster: "us2",
  useTLS: true,
});

app.get("/", (req, res) => {
  res.status(200).send("hello");
});

app.get("/api/v1/messages/sync", (req, res) => {
  messages.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.post("/api/v1/messages", (req, res) => {
  messages.create(req.body, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.get("/api/v1/users", (req, res) => {
  users.find((err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.post("/api/v1/users", (req, res) => {
  users.create(req.body, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.post("/api/v1/users/login", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    users.findOne({ username }, (err, data) => {
      if (err || !data) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(404).send("not found");
        }
      } else {
        bcrypt.compare(password, data.password, (err, isMatch) => {
          if (err) {
            console.log(err);
            res.status(500).send(err);
          }
          if (isMatch) {
            console.log("Passwords match");
            res.status(200).send("data");
          } else {
            console.log("passwords do not match");
            res.status(401).send("gell");
          }
        });
      }
    });
  }
});

app.listen(port, () => {
  console.log("listening on port 9000");
});
