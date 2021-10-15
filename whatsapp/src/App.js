import "./app.css";

import React, { useState, useEffect } from "react";

import { Sidebar } from "./components/sidebar";
import { Chat } from "./components/chat";
import Pusher from "pusher-js";
import axios from "./axios";

function App() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState({ name: "" });
  useEffect(() => {
    axios
      .get("api/v1/messages/sync")
      .then((res) => {
        setMessages(res.data.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    //this is all the scripts that pusher provides us when we create a new app
    const pusher = new Pusher("88b1a2c5a3cd9922487d", {
      cluster: "us2",
    });

    const channel = pusher.subscribe("messages"); // same names from our backend
    channel.bind("inserted", function (data) {
      //alert(JSON.stringify(data));
      // when a new message is inserted, we will get the data in the var data
      //then we set it to the useState where we are fetching, to have it stored live
      setMessages([data, ...messages]);
    });

    return () => {
      channel.unsubscribe();
      channel.unbind_all();
      // we unsubscribe to all of those events
    };
  }, [messages]);

  return (
    <section className="app">
      <div className="container">
        <Sidebar user={user} setUser={setUser} />
        <Chat messages={messages} user={user} />
      </div>
    </section>
  );
}

export default App;
