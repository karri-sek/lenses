import React from "react";
import { connect, MapStateToProps } from "react-redux";
import axios from 'axios';
import Connect from "../components/Connect";
import Subscribe from "../components/Subscribe";
import MessageList from "../components/MessageList";
import { Message, State } from "../config/state";
import { actions } from "../actions";

export type MainContainerProps = {
  commit: (message: Message) => void;
};

export type MainContainerStateProps = {
  messages: Message[];
  user: string;
  password: string;
  tokenReceived: (payload: string) => Record<string, unknown>;
};

const login =  async (user: string, password: string, tokenReceived:any):Promise<Record<string, unknown>> => {
  const url = 'http://localhost:3030/api/login';
  const data = {user, password}
  const result  =  await axios.post(url, data);
  tokenReceived(result.data);
  return { 'X-Kafka-Lenses-Token': result};

}
const _MainContainer: React.FC<MainContainerProps & MainContainerStateProps> =
  ({ messages, commit, user, password, tokenReceived}) => (
    <div className="container app">
      <div className="columns">
        <div className="column">
          <Connect onLogin={()=>login(user, password, tokenReceived)} />
        </div>
      </div>
      <div className="columns">
        <div className="column">
          <Subscribe />
          {messages.length ? (
            <MessageList messages={messages} onCommitMessage={commit} />
          ) : null}
        </div>
      </div>
    </div>
  );

const mapDispatchToProps = {
    ...actions,
  };
  
  const mapStateToProps = (state: State) => ({
  messages: state.session.messages,
  user: state.session.user,
  password: state.session.password
});

export const MainContainer = connect(mapStateToProps, mapDispatchToProps)(_MainContainer);
