

import Header from '@/components/header';
import { Outlet } from 'react-router-dom'

const AppLayout = () => {
  return (
    <div>
      <div className="grid-background"></div>
      <div className="container mx-auto">
        <main className="min-h-screen">
          <Header />
          <Outlet />
        </main>
        
      </div>
      <div className="p-10 text-center bg-gray-800 mt-10">Made with ❤️ by Abhay</div>
    </div>
  );
};

export default AppLayout;
