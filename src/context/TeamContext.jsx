import { createContext, useContext, useState } from 'react'

const TeamContext = createContext(null)

export function TeamProvider({ children }) {
  const [selectedTeam, setSelectedTeam] = useState(null)

  return (
    <TeamContext.Provider value={{
      selectedTeam,
      selectTeam: setSelectedTeam,
      clearTeam: () => setSelectedTeam(null),
    }}>
      {children}
    </TeamContext.Provider>
  )
}

export function useTeam() {
  return useContext(TeamContext)
}
