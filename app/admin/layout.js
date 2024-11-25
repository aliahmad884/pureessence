import AdminNav from './adminComponents/adminNav';
import AdminToolbar from './adminComponents/adminToolBar';
import AdminContextProvider from './adminContext';
// import './adminMediaQueries.css';
// import './adminStyles.css';


export const metadata = {
    title: 'Admin | PurEssence '
}

export default function AdminLayout({ children }) {
    return (
        <>
            <AdminContextProvider>
                <AdminNav />
                <AdminToolbar />
                {children}
            </AdminContextProvider>
        </>
    )
}