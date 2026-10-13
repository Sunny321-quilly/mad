import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialAnnouncements, initialEvents, ROLES } from '../data/sampleData';

const AppContext = createContext();

const STORAGE_KEYS = {
  ANNOUNCEMENTS: '@campusconnect_announcements',
  EVENTS: '@campusconnect_events',
  BOOKMARKS: '@campusconnect_bookmarks',
  ROLE: '@campusconnect_role',
};

const initialState = {
  announcements: initialAnnouncements,
  events: initialEvents,
  bookmarks: [],
  role: ROLES.STUDENT,
  loading: true,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ANNOUNCEMENTS':
      return { ...state, announcements: action.payload };

    case 'SET_EVENTS':
      return { ...state, events: action.payload };

    case 'SET_BOOKMARKS':
      return { ...state, bookmarks: action.payload };

    case 'TOGGLE_BOOKMARK': {
      const exists = state.bookmarks.find(b => b.id === action.payload.id);
      const bookmarks = exists
        ? state.bookmarks.filter(b => b.id !== action.payload.id)
        : [...state.bookmarks, action.payload];
      return { ...state, bookmarks };
    }

    case 'ADD_ANNOUNCEMENT':
      return { ...state, announcements: [action.payload, ...state.announcements] };

    case 'UPDATE_ANNOUNCEMENT':
      return {
        ...state,
        announcements: state.announcements.map(a =>
          a.id === action.payload.id ? action.payload : a
        ),
      };

    case 'DELETE_ANNOUNCEMENT':
      return {
        ...state,
        announcements: state.announcements.filter(a => a.id !== action.payload),
      };

    case 'ADD_EVENT':
      return { ...state, events: [action.payload, ...state.events] };

    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(e =>
          e.id === action.payload.id ? action.payload : e
        ),
      };

    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter(e => e.id !== action.payload),
      };

    case 'SET_ROLE':
      return { ...state, role: action.payload };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    loadPersistedData();
  }, []);

  useEffect(() => {
    if (!state.loading) {
      persistData();
    }
  }, [state.announcements, state.events, state.bookmarks, state.role, state.loading]);

  const loadPersistedData = async () => {
    try {
      const [annStr, evStr, bmStr, roleStr] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS),
        AsyncStorage.getItem(STORAGE_KEYS.EVENTS),
        AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS),
        AsyncStorage.getItem(STORAGE_KEYS.ROLE),
      ]);

      if (annStr) {
        const anns = JSON.parse(annStr);
        if (anns.length > 0) dispatch({ type: 'SET_ANNOUNCEMENTS', payload: anns });
      }
      if (evStr) {
        const evts = JSON.parse(evStr);
        if (evts.length > 0) dispatch({ type: 'SET_EVENTS', payload: evts });
      }
      if (bmStr) {
        dispatch({ type: 'SET_BOOKMARKS', payload: JSON.parse(bmStr) });
      }
      if (roleStr) {
        dispatch({ type: 'SET_ROLE', payload: roleStr });
      }
    } catch (e) {
      // ignore
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const persistData = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(state.announcements)),
        AsyncStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(state.events)),
        AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(state.bookmarks)),
        AsyncStorage.setItem(STORAGE_KEYS.ROLE, state.role),
      ]);
    } catch (e) {
      // ignore
    }
  };

  const value = {
    ...state,
    dispatch,
    toggleBookmark: (event) => dispatch({ type: 'TOGGLE_BOOKMARK', payload: event }),
    addAnnouncement: (a) => dispatch({ type: 'ADD_ANNOUNCEMENT', payload: a }),
    updateAnnouncement: (a) => dispatch({ type: 'UPDATE_ANNOUNCEMENT', payload: a }),
    deleteAnnouncement: (id) => dispatch({ type: 'DELETE_ANNOUNCEMENT', payload: id }),
    addEvent: (e) => dispatch({ type: 'ADD_EVENT', payload: e }),
    updateEvent: (e) => dispatch({ type: 'UPDATE_EVENT', payload: e }),
    deleteEvent: (id) => dispatch({ type: 'DELETE_EVENT', payload: id }),
    setRole: (role) => dispatch({ type: 'SET_ROLE', payload: role }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
