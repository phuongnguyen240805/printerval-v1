// import React, { createContext, useContext, useMemo } from 'react';
// import { api } from '@/utils/api';

// export interface IMedusaContext {
//   saleProducts: any[];
//   isLoadingSale: boolean;
//   isError: boolean;
// }

// export const MedusaContext = createContext<IMedusaContext | undefined>(undefined);

// export const MedusaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const regionID = typeof window !== 'undefined' ? localStorage.getItem("selected_region") : null;

//   const { 
//     data: saleProducts, 
//     isLoading: isLoadingSale, 
//     isError 
//   } = api.medusa.getSaleProducts.useQuery(
//     { regionID: regionID ?? "" },
//     { 
//       enabled: !!regionID, 
//       staleTime: 1000 * 60 * 5, 
//     }
//   );

//   const value = useMemo(() => ({
//     saleProducts: saleProducts || [],
//     isLoadingSale,
//     isError
//   }), [saleProducts, isLoadingSale, isError]);

//   return (
//     <MedusaContext.Provider value={value}>
//       {children}
//     </MedusaContext.Provider>
//   );
// };

// // 3. Hook để sử dụng
// export const useMedusa = () => {
//   const context = useContext(MedusaContext);
//   if (context === undefined) {
//     throw new Error('useMedusa must be used within a MedusaProvider');
//   }
//   return context;
// };