import AdminNav from './adminComponents/adminNav';
import AdminToolbar from './adminComponents/adminToolBar';
import AdminContextProvider from './adminContext';
import { getUserInfo } from './helper';
// import './adminMediaQueries.css';
// import './adminStyles.css';
import { Toaster } from "@/components/ui/sonner";


export const metadata = {
    title: 'Admin | PurEssence '
}

export default async function AdminLayout({ children }) {
    const userInfo =await getUserInfo()
    return (
        <div className='adminBody'>
            <Toaster position="top-center" richColors />
            <AdminContextProvider user={userInfo}>
                <AdminNav />
                <AdminToolbar />
                {children}
            </AdminContextProvider>
        </div>
    )
}