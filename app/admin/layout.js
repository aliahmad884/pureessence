
import AdminNav from './adminComponents/adminNav';
import AdminToolbar from './adminComponents/adminToolBar';
// import './adminMediaQueries.css';
// import './adminStyles.css';


export const metadata = {
    title: 'Admin | PurEssence '
}

export default function AdminLayout({ children }) {
    return (
        <>
            <AdminNav />
            <AdminToolbar />
            {children}
        </>
    )
}