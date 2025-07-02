import { createContext, useState, useContext, useEffect } from 'react';

const AvatarContext = createContext();

export function AvatarProvider({ children }) {
  const [avatar, setAvatar] = useState(localStorage.getItem('avatar') || '');

  useEffect(() => {
    if (avatar) {
      localStorage.setItem('avatar', avatar);
    }
  }, [avatar]);

  return (
    <AvatarContext.Provider value={{ avatar, setAvatar }}>
      {children}
    </AvatarContext.Provider>
  );
}

export function useAvatar() {
  return useContext(AvatarContext);
}
