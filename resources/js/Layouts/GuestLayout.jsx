export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex flex-col items-center pt-6 sm:pt-0">
                {children}
            </div>
        </div>
    );
} 