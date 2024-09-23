
export default function AdminLayout({ children }) {
    return (
        <html>
            <head>
                <title>Admin Home</title>
            </head>
            <body style={{paddingTop:'0'}}>
                {children}
            </body>
        </html>
    )
}