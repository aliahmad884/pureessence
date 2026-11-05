import AdminNav from './adminComponents/adminNav';
import AdminToolbar from './adminComponents/adminToolBar';
import AdminContextProvider from './adminContext';
import { getUserInfo } from './helper';
// import './adminMediaQueries.css';
// import './adminStyles.css';


export const metadata = {
    title: 'Admin | PurEssence '
}

export default function AdminLayout({ children }) {
    const userInfo = getUserInfo()
    return (
        <div className='adminBody'>
            <AdminContextProvider user={userInfo}>
                <AdminNav />
                <AdminToolbar />
                {children}
            </AdminContextProvider>
        </div>
    )
}