import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const getStoredUser = () => {
  const storedUser = localStorage.getItem('user');
  return storedUser
    ? JSON.parse(storedUser)
    : { email: null, fullName: null, phone: null, role: null };
};

// const getStoredIsLoggedIn = () => {
//   const storedLoggedIn = localStorage.getItem('isLoggedIn');
//   return storedLoggedIn === 'true';
// };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [isLoggedIn, setIsLoggedIn] = useState(!!getStoredUser().email);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('user', JSON.stringify(user));
      //localStorage.setItem('isLoggedIn', 'true');
    } else {
      localStorage.removeItem('user');
      //localStorage.removeItem('isLoggedIn');
    }
  }, [user, isLoggedIn]);

  const loginUser = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUser({ full_name: null, email: null, phone: null, role: null });
    setIsLoggedIn(false);
  };
  // const logout = () => {
  //   setUser({ email: null, fullName: null, phone: null, role: null });
  //   setIsLoggedIn(false);
  //   localStorage.removeItem('user');
  //   localStorage.removeItem('isLoggedIn');
  // };


  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        loading,
        setLoading,
        loginUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};



// const logout = async () => {
//   try {
//     await fetch('http://localhost:8080/backend/api/user/logout', {
//       method: 'POST',
//       credentials: 'include', // send cookie to backend
//     });
//   } catch (error) {
//     console.error('Logout API error:', error);
//   } finally {
//     setUser({ email: null, role: null, fullName: null });
//     setIsLoggedIn(false);
//     localStorage.removeItem('user');
//     localStorage.removeItem('isLoggedIn');
//   }
// };

// useEffect(() => {
//   const fetchProfile = async () => {
//     try {
//       const res = await fetch('http://localhost:8080/backend/api/user/profile', {
//         method: 'GET',
//         credentials: 'include', // send cookies with request
//       });

//       if (res.ok) {
//         const data = await res.json();
//         setUser({
//           email: data.email,
//           role: data.role,
//           fullName: data.fullName,
//         });
//         setIsLoggedIn(true);
//       } else {
//         logout(); // token expired or invalid → logout
//       }
//     } catch (error) {
//       console.error('Error fetching profile:', error);
//       logout();
//     }
//   };

//   fetchProfile();
// }, []);

// Sync auth state to localStorage
