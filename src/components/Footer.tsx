export default function Footer() {
    return (
        <footer className="border-t border-gray-200 dark:border-gray-800 mt-12 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
                <p>&copy; {new Date().getFullYear()} My Blog. All rights reserved.</p>
            </div>
        </footer>
    );
}
