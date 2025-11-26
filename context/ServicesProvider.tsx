// ServicesProvider.tsx
import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { SMMService } from '../types';

interface ServicesContextType {
  services: SMMService[];
  loading: boolean;
}

export const ServicesContext = createContext<ServicesContextType>({
  services: [],
  loading: true,
});

export const ServicesProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [services, setServices] = useState<SMMService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://localhost:7220/api/apitest/services') // استبدل هذا بالرابط الصحيح لـ SMM API
      .then(res => res.json())
      .then(data => {
        // تأكد من تحويل الـ rate لـ number لو رجع string
        const formatted = data.map((s: any) => ({ ...s, rate: Number(s.rate) }))
        .then(console.log)
        .catch(console.error);
        setServices(formatted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <ServicesContext.Provider value={{ services, loading }}>
      {children}
    </ServicesContext.Provider>
  );
};
