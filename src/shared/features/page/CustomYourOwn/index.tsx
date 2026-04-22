'use client';

import { CustomDesigner } from './components/editor';

export const CreateYourOwnDesigner = () => {
  return (
    <div className="w-full h-screen">
      <CustomDesigner
        initialData={{
          id: "create-your-own",
          json: undefined,
          width: 800,
          height: 600,
        }}
        onSave={(data) => {
          console.log("Design saved:", data);
          // Here you can save to your database or local storage
          localStorage.setItem('designJSON', data.json);
        }}
      />
    </div>
  );
};
