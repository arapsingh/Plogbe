import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray text-black py-6">
            <div className="container mx-auto px-4">
                <nav className="mb-4">
                    <ul className="flex justify-center space-x-4">
                        <li>
                            <Link to="/" className="hover:underline">Home</Link>
                        </li>
                        <li>
                            <Link to="/about" className="hover:underline">About</Link>
                        </li>
                        <li>
                            <Link to="/contact" className="hover:underline">Contact</Link>
                        </li>
                    </ul>
                </nav>
                <div className="text-center">
                    <p>&copy; {new Date().getFullYear()} Plog. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;