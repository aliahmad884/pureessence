import { AdminUser } from '../api/schemas';
import AdminNav from './adminComponents/adminNav';
import AdminToolbar from './adminComponents/adminToolBar';
import AdminContextProvider from './adminContext';
import { getUserInfo } from './helper';


export const metadata = {
    title: 'Admin | PurEssence '
}

export default async function AdminLayout({ children }) {
    const userInfo = await getUserInfo("authAdmin", AdminUser, process.env.JWT_SEC_KEY)
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