'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { PersonaType, getPersona, Persona } from '@/lib/diction-adapter';

interface PersonaContextType {
    persona: Persona;
    setPersonaId: (id: PersonaType) => void;
}

const PersonaContext = createContext<PersonaContextType>({
    persona: getPersona('startup_professional'),
    setPersonaId: () => { },
});

export function PersonaProvider({ children }: { children: React.ReactNode }) {
    const [personaId, setPersonaIdState] = useState<PersonaType>('startup_professional');

    useEffect(() => {
        const saved = localStorage.getItem('pilot_persona') as PersonaType;
        if (saved && ['startup_professional', 'cybernetic_biopunk', 'academic_formal'].includes(saved)) {
            setPersonaIdState(saved);
        }
    }, []);

    const setPersonaId = (id: PersonaType) => {
        setPersonaIdState(id);
        localStorage.setItem('pilot_persona', id);
    };

    const value = {
        persona: getPersona(personaId),
        setPersonaId
    };

    return (
        <PersonaContext.Provider value={value}>
            {children}
        </PersonaContext.Provider>
    );
}

export const usePersona = () => useContext(PersonaContext);
