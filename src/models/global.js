import { take } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { message } from 'antd';

const send = (msg, IP, ws) => {
  const enframedMsg = `SEND_TO ${IP}
  ${msg}`;
  ws.send(enframedMsg);
};


function createSocketChannel(socket) {

  return eventChannel(emit => {

    const messageHandler = event => {
      emit(event);
    };

    const errorHandler = event => {
      emit(event);
    };

    socket.addEventListener('message', messageHandler);
    socket.addEventListener('error', errorHandler);

    const unsubscribe = () => {
      socket.removeEventListener('message', messageHandler);
    };

    return unsubscribe;
  });
}


const parseWsMessage = data => {
  const byLine = data.split('\n');
  const bySpace = byLine[0].split(' ');
  const type = bySpace[0];
  const key = bySpace[1];
  const text = byLine[1];
  return { type, key, text };
};


export default {
  namespace: 'global',
  state: {
    serverInfoTextArea: '',
    visible: false,
    wsUrl: '',
    webSocket: null,
    openWindows: [],
  },
  reducers: {
    toggleVisible(state) {
      return { ...state, visible: !state.visible }
    },
    newWindow(state) {
      return {
        ...state, openWindows: [...state.openWindows, {
          IP: '?:?:?:?',
          messages: [],
          textAreaValue: '',
        },
        ],
      };
    },
    removeWindow(state, { payload: key }) {
      const removedIdx = state.openWindows.findIndex(item => item.IP === key);
      return {
        ...state, openWindows: [...state.openWindows.slice(0, removedIdx),
          ...state.openWindows.slice(removedIdx + 1, state.openWindows.length)],
      };
    },
    updateTextField(state, { payload: { key, value } }) {
      const updatedWindowIdx = state.openWindows.findIndex(item => item.IP === key);
      let updatedWindow = state.openWindows[updatedWindowIdx];
      updatedWindow.textAreaValue = value;
      return {
        ...state, openWindows: [...state.openWindows.slice(0, updatedWindowIdx),
          updatedWindow, ...state.openWindows.slice(updatedWindowIdx + 1, state.openWindows.length)],
      };
    },
    addMessage(state, { payload: { key, value } }) {
      const updatedWindowIdx = state.openWindows.findIndex(item => item.IP === key);
      let updatedWindow = state.openWindows[updatedWindowIdx];
      updatedWindow.messages.push(value);
      return {
        ...state, openWindows: [...state.openWindows.slice(0, updatedWindowIdx),
          updatedWindow, ...state.openWindows.slice(updatedWindowIdx + 1, state.openWindows.length)],
      };
    },
    addWebSocket(state, { payload: ws }) {
      return { ...state, webSocket: ws };
    },
    updateIP(state, { payload: { key, IP } }) {
      const updatedWindowIdx = state.openWindows.findIndex(item => item.IP === key);
      let updatedWindow = state.openWindows[updatedWindowIdx];
      updatedWindow.IP = IP;
      updatedWindow.textAreaValue = '';
      return {
        ...state, openWindows: [...state.openWindows.slice(0, updatedWindowIdx),
          updatedWindow, ...state.openWindows.slice(updatedWindowIdx + 1, state.openWindows.length)],
      };
    },
    clearMessages(state, { payload: key }) {
      const updatedWindowIdx = state.openWindows.findIndex(item => item.IP === key);
      let updatedWindow = state.openWindows[updatedWindowIdx];
      updatedWindow.messages = [];
      return { ...state, openWindows: [...state.openWindows.slice(0, updatedWindowIdx),
          updatedWindow, ...state.openWindows.slice(updatedWindowIdx + 1, state.openWindows.length)]
      };
    },
    removeLastMessage(state, { payload: key }) {
      const updatedWindowIdx = state.openWindows.findIndex(item => item.IP === key);
      let updatedWindow = state.openWindows[updatedWindowIdx];
      updatedWindow.messages = updatedWindow.messages.slice(0, updatedWindow.messages.length - 2);
      return { ...state, openWindows: [...state.openWindows.slice(0, updatedWindowIdx),
          updatedWindow, ...state.openWindows.slice(updatedWindowIdx + 1, state.openWindows.length)]
      };
    },
    updateWsUrl(state, { payload: wsUrl }) {
      return { ...state, wsUrl }
    }
  },
  effects: {
    * updateServerInfo(action, { call, put }) {
      yield put({ type: 'updateWsUrl', payload: action.payload });
      yield put({ type: 'connectToWsServer' });
    },
  	* addNewWindow(action, { call, put, select }) {
  	  const windows = yield select(({ global }) => global.openWindows);
  	  const window = windows.filter(window => window.IP === '?:?:?:?')[0];
  	  if (!window)
  		yield put({ type: 'newWindow' });
  	},
    * send(action, { call, put, select }) {
      const ws = yield select(({ global }) => global.webSocket);
      if (!ws) {
        yield call(message.info, 'You aren\'t connected to server', 2);
      }
      const openWindows = yield select(({ global }) => global.openWindows);
      const window = openWindows.filter(item => item.IP === action.payload)[0];
      const textAreaValue = window.textAreaValue;
      const target = window.IP;
      if (textAreaValue !== '' && target !== '?:?:?:?') {
        yield put({
          type: 'addMessage', payload: {
            key: action.payload, value: {
              author: 'user',
              text: textAreaValue,
            },
          },
        });
      }
      yield put({ type: 'updateTextField', payload: { key: action.payload, value: '' } });
      yield call(send, textAreaValue, target, ws);
    },
    * connectToWsServer(action, { call, put, select }) {
  	  const wsUrl = yield select(({ global }) => global.wsUrl);
      const ws = new WebSocket(`ws://${wsUrl}/chat`);
      const socketChannel = yield createSocketChannel(ws);
      yield put({ type: 'addWebSocket', payload: ws });
      while (true) {            // :o
        try {
          const event = yield take(socketChannel);
          if (event.type === 'message') {
            const { type, key, text } = yield call(parseWsMessage, event.data);
            if (type === 'NOT_CONNECTED') {
              yield put({
                type: 'clearMessages',
                payload: key,
              });
              yield put({
                type: 'addMessage', payload: {
                  key, value: {
                    author: 'other',
                    text: 'Person with such IP isn\'t (yet) connected'
                  },
                },
              });
            } else if (type === 'MESSAGE_TO') {
              yield put({
                type: 'addMessage', payload: {
                  key, value: {
                    author: 'other',
                    text,
                  },
                },
              });
            }
          } else if (event.type === 'error') {
            yield call(message.error, 'Cannot connect to WebSocket server', 10);
          }
        } catch (err) {
          console.error('socket error:', err);
          socketChannel.close();
        }
      }
    },
    * addNewConnection(action, { call, put, select }) {
      const windows = yield select(({ global }) => global.openWindows);
      const window = windows.filter(window => action.payload.IP === window.IP)[0];
      if (!window) {
	    yield put({ type: 'updateIP', payload: action.payload });
	    yield put({ type: 'clearMessages', payload: action.payload.IP });
      }
    },
  },
  subscriptions: { },
};
