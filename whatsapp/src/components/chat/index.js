import React, { useState, useEffect } from "react";
import axios from "../../axios";
import "./chat.css";

export const Chat = ({ messages, user }) => {
  const [message, setMessage] = useState({ msg: "", name: user.name });
  const [chat, setChat] = useState([]);
  const [handler, setHandler] = useState(false);
  const [msf, setmsf] = useState([]);

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    setMessage({ [name]: value, name: user.name });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const { msg, name } = message;
    axios.post("/api/v1/messages", { message: msg, name: name });
    setMessage({ msg: "", name: message.name });
  };

  return (
    <section className="chatRender">
      <div className="userChatBar"></div>
      <div className="chat">
        {messages.map((mesg, index) => {
          const { message, name } = mesg;
          return (
            <>
              {user.name === name ? (
                <div className="messagesContainer-sender" key={index}>
                  <p className="name">{name}</p>
                  <p className="message"> {message} </p>
                </div>
              ) : (
                <div className="messagesContainer-receiver" key={index}>
                  <p className="name">{name}</p>
                  <p className="message"> {message} </p>
                </div>
              )}
            </>
          );
        })}
      </div>
      <form className="inputTextContainer" onSubmit={(e) => handleSubmit(e)}>
        <input
          type="text"
          className="inputText"
          placeholder="enter to send message"
          name="msg"
          value={message.msg}
          onChange={(e) => handleChange(e)}
        />
      </form>
    </section>
  );
};
