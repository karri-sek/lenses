import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import classnames from "classnames";
import { actions } from "../actions";
import Button from "./Button";
import { Message, State } from "../config/state";

export type SubscribeStateProps = {
  messages: Message[];
  token: string;
  messageReceived: (payload: string) => Record<string, unknown>;
};

export type SubscribeProps = {
  clearMessages: ()=>void
};

const _Subscribe: React.FC<SubscribeProps & SubscribeStateProps> = ({
  messages,
  token,
  clearMessages,
  messageReceived
}) => {
  const [sqls, setSqlState] = useState("");
   let noOfMessages = 0;

  const onSqlsChange = (event:React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = event.currentTarget;
    const value = target.value;
    setSqlState(value);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onSubscribe = async () => { 
    const client = new WebSocket(`ws://localhost:3030/api/ws/v2/sql/execute`);
    const obj = {
      "token": token,
      "stats": 2,
      "sql": sqls,
      "live": false
    }
    client.onopen= () => client.send(JSON.stringify(obj));
    
    client.onmessage = (m:any) => {
      const msgData = JSON.parse(m.data);
      const {data} = msgData;
      if(noOfMessages > 10){
        client.close();
      }else{
        noOfMessages++;
        messageReceived(data);
      }
    }
};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onUnsubscribe = (topic:string) => {topic};

  const btnStyle = classnames("button is-small is-info");

  return (
    <nav className="ws-subscribe panel">
      <div className="panel-heading">
        <div className="field has-addons">
          <p className="control is-expanded">
            <textarea
              className="textarea is-small is-info"
              placeholder="SQLS"
              value={sqls}
              onChange={onSqlsChange}
            />
          </p>
        </div>
      </div>
      <div className="panel-block">
        <div className="control">
          <Button
            style={{ marginRight: "10px" }}
            onClick={onSubscribe}
            className={btnStyle}
            disabled={!sqls}
          >
            Subscribe
          </Button>
          <Button
            onClick={clearMessages}
            className="button is-small is-danger"
          >
            Clear Messages
          </Button>
        </div>
      </div>
      <div className="panel-block">
        <div className="control">Number of messages: {messages.length}</div>
      </div>
    </nav>
  );
}

const mapStateToProps = (state:State) => ({
  messages: state.session.messages,
  token: state.session.token || ''
});

const mapDispatchToProps = {
  ...actions,
};

const Subscribe = connect(mapStateToProps, mapDispatchToProps)(_Subscribe);

export default Subscribe;
