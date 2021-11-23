import React,{ useState, useEffect, useRef } from "react";
import { List, AutoSizer } from "react-virtualized";
import { connect } from "react-redux";
import { actions } from "../actions";
import ListItemDetails from "./ListItemDetails";
import { Message, State} from "../config/state";

export type MessageListProps = {
    messages: Message[];
    onCommitMessage: (message: Message) => void;
  };

  export type MessageListItemProps = {
    className?: string;
    key: string;
    label: string;
    value: string;
  };
  interface IData {
    label: string;
    value: string;
  }

  interface IMessageItem {
    key: string;
    index: number;
    style: {};
  }

  const _MessageList: React.FC<MessageListProps> = ({ messages, onCommitMessage })=> {
    const listRef = useRef()
  const [message, setMessage] = useState({message:''});

  useEffect(() => {
    if (!message) {
        //listRef.scrollToRow(messages.length);
      }
  }, [])

  

  const onShowRowDetails = (d: string) => setMessage({ message: d });
  

  const rowRenderer = (messages: Message[]) => ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    style, // Style object to be applied to row (to position it)
  }: IMessageItem) => {
    const arr: IData[] = [];
    const keys: IData[] = [];
    if(messages[index].key){
        keys.push({ label: messages[index].key, value: (messages[index].key) });
        Object.keys((messages[index].value)).forEach(function(k) {
        arr.push({ label: k, value: (messages[index].value)[k] });
      });
    }
    

    return (
      <div
        key={key}
        style={style}
        className="message-row columns ws-message-list is-multiline"
        onClick={()=>onShowRowDetails(messages[index])}
      >
        <div className="column is-2">
          <div>Index</div>
          {index}
        </div>
        {keys.map(item => (
          <MessageListItem
            className="key"
            key={item.label}
            label={item.label}
            value={item.value}
          />
        ))}
        {arr.map(item => (
          <MessageListItem
            key={item.label}
            label={item.label}
            value={item.value}
          />
        ))}
      </div>
    );
  };

    return (
      <div>
        <ListItemDetails
          message={message}
          onCommitMessage={onCommitMessage}
          onShowRowDetails={onShowRowDetails}
        />
        <nav className="panel">
          <div className="panel-block">
            <AutoSizer className="autosizer-bulma-fix">
              {({ width=0 }) => (
                <List
                  width={width}
                  height={290}
                  rowCount={messages.length}
                  rowHeight={160}
                  rowRenderer={rowRenderer(messages)}
                />
              )}
            </AutoSizer>
          </div>
        </nav>
      </div>
    );
}

 const MessageListItem: React.FC<MessageListItemProps> = ({ key, label, value })  =>  
      <div className="column is-2">
        <div>{label}</div>
        {value}
      </div>



const mapStateToProps = (state:State) => ({
  message: state.session.message,
});

const mapDispatchToProps = {
  ...actions
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(_MessageList);
