import { createContext, useReducer, useEffect } from "react";

export const UserStateContext = createContext();
export const UserDispatchContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN": {
      return {
        token: action.token,
        userId: action.userId,
        userName: action.userName
      };
    }
    case "LOGOUT": {
      return {
        token: "",
        userId: "",
        userName: ""
      };
    }
    default: {
      throw new Error("Unhandled action type.");
    }
  }
};

const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { token:null, userId:null, userName:null });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
};

export default UserProvider;
