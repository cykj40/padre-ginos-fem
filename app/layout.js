import './globals.css'
import Providers from './providers'

export const metadata = {
    title: 'Papa Giorgio\'s Pizza',
    description: 'Delicious pizza delivered to your door',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet" />
            </head>
            <body>
                <Providers>
                    {children}
                </Providers>
                <div id="modal"></div>
            </body>
        </html>
    )
} 