import { createContext,useContext,useState } from "react";
const UserContext = createContext();

export const useUser=()=>useContext(UserContext);

export function Userprovider({children}){
    const [user,setUser]=useState(null);

    const login=(userData)=>{
        setUser(userData);
    }
    const signup=(userData)=>{
        setUser(userData);
    }

    const logout=()=>{
        setUser(null);
    }
    return (
    <UserContext.Provider value={{ user, setUser,login, logout ,signup}}>
      {children}
    </UserContext.Provider>
  );
}
