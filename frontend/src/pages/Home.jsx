// Home.jsx
// Import React hooks
import { useEffect, useState } from "react";
// useNavigate helps us move from one page to another
import { Link, useNavigate } from "react-router-dom";

// Import CSS file
import "./Home.css";

// --------------------------------------------------
// PRODUCT DATA
// --------------------------------------------------
// For now, we are keeping product data here.
// Later, we can get this data from MongoDB through our backend API.

const products = [
    {
        id: 1,
        prod_name: "Mushroom",
        price: 10,
        image:
            "https://images.unsplash.com/photo-1604908177520-1e3f5b6c8f3d?auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 2,
        prod_name: "Tomato",
        price: 40,
        image:
            "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 3,
        prod_name: "Potato",
        price: 35,
        image:
            "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 4,
        prod_name: "Onion",
        price: 45,
        image:
            "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 5,
        prod_name: "Carrot",
        price: 50,
        image:
            "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 6,
        prod_name: "Broccoli",
        price: 60,
        image:
            "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 7,
        prod_name: "Apple",
        price: 120,
        image:
            "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 8,
        prod_name: "Banana",
        price: 60,
        image:
            "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 9,
        prod_name: "Orange",
        price: 90,
        image:
            "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 10,
        prod_name: "Strawberry",
        price: 150,
        image:
            "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 11,
        prod_name: "Mango",
        price: 100,
        image:
            "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 12,
        prod_name: "Watermelon",
        price: 80,
        image:
            "https://images.unsplash.com/photo-1563114773-84221bd62daa?auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 13,
        prod_name: "Milk",
        price: 55,
        image:
            "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 14,
        prod_name: "Bread",
        price: 45,
        image:
            "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 15,
        prod_name: "Eggs",
        price: 70,
        image:
            "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 16,
        prod_name: "Cheese",
        price: 180,
        image:
            "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 17,
        prod_name: "Rice",
        price: 75,
        image:
            "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 18,
        prod_name: "Chicken",
        price: 220,
        image:
            "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 19,
        prod_name: "Spinach",
        price: 30,
        image:
            "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 20,
        prod_name: "Capsicum",
        price: 70,
        image:
            "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=500&q=60"
    }
];


// --------------------------------------------------
// HOME COMPONENT
// --------------------------------------------------

function Home() {

    // Used to navigate to different pages
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(() => {
        return JSON.parse(localStorage.getItem("cart") || "[]").length;
    });


    // --------------------------------------------------
    // GET LOGIN INFORMATION
    // --------------------------------------------------
    // When the user logs in, we stored these values
    // in localStorage.
    
    const token = localStorage.getItem("token");

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );


    // --------------------------------------------------
    // CHECK AUTHENTICATION
    // --------------------------------------------------
    // If the user is not logged in, send them to Login page.

    useEffect(() => {

        if (!token) {
            navigate("/login");
        }

    }, [token, navigate]);


    // --------------------------------------------------
    // LOGOUT FUNCTION
    // --------------------------------------------------
    // Remove login information from localStorage
    // and send the user back to Login page.

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };


    // --------------------------------------------------
    // ADD TO CART
    // --------------------------------------------------
    // For now we are only displaying an alert.
    // Later we can store the product in a cart.

    const addToCart = (product) => {
        let cart = JSON.parse(localStorage.getItem("cart") || "[]");
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        setCartCount(cart.length);

        alert(`${product.prod_name} added to cart!`);


    };


    // --------------------------------------------------
    // PAGE UI
    // --------------------------------------------------

    return (

        <div className="home-page">

            {/* ================= NAVBAR ================= */}

            <nav className="navbar">

                {/* Store name */}
                <h1>🛍️ My Store</h1>


                {/* Navigation links */}
                <div className="nav-links">

                    <Link to="/home">
                        🏠 Home
                    </Link>

                    <Link to="/cart">
                        🛒 Cart ({cartCount})
                    </Link>

                    <Link to="/profile">
                        👤 Profile
                    </Link>

                    <Link to="/orders">
                        📦 Orders
                    </Link>

                    {/* Logout is a button because it performs an action */}
                    <button onClick={logout}>
                        🚪 Logout
                    </button>

                </div>

            </nav>


            {/* ================= WELCOME / HERO ================= */}

            <section className="hero">

                <div className="hero-content">

                    <h2>
                        Welcome to My Store! 🛍️
                    </h2>


                    {/* 
                        IMPORTANT:
                        The variable is "user", not "User".

                        JavaScript is case-sensitive.
                    */}

                    <h1>
                        Hello, {user?.name || "Customer"}! 👋
                    </h1>


                    <p>
                        Discover the best products at unbeatable prices.
                    </p>


                    <button>
                        Shop Now 🛒
                    </button>


                    <p className="hero-description">
                        🚚 Free shipping on orders over ₹500!
                    </p>

                </div>

            </section>


            {/* ================= PRODUCTS ================= */}

            <section className="product-listing">

                <h2>
                    Featured Products 🛍️
                </h2>


                <div className="product-grid">


                    {/* ================= CATEGORIES ================= */}

                    <div className="categories">

                        <h3>
                            Categories
                        </h3>

                        <ul>

                            <li>
                                <Link to="/category/vegetables">
                                    🥦 Vegetables
                                </Link>
                            </li>

                            <li>
                                <Link to="/category/fruits">
                                    🍎 Fruits
                                </Link>
                            </li>

                            <li>
                                <Link to="/category/dairy">
                                    🥛 Dairy
                                </Link>
                            </li>

                            <li>
                                <Link to="/category/bakery">
                                    🍞 Bakery
                                </Link>
                            </li>

                            <li>
                                <Link to="/category/meat">
                                    🍗 Meat
                                </Link>
                            </li>

                        </ul>

                    </div>


                    {/* ================= PRODUCT CARDS ================= */}

                    {products.map((product) => (

                        <div
                            key={product.id}
                            className="product-card"
                        >

                            {/* Product image */}
                            <img
                                src={product.image}
                                alt={product.prod_name}
                            />


                            {/* Product name */}
                            <h3>
                                {product.prod_name}
                            </h3>


                            {/* Product price */}
                            <p>
                                ₹{product.price}
                            </p>


                            {/* Add to cart button */}
                            <button
                                onClick={() => addToCart(product)}>
                                Add to Cart 🛒
                            </button>

                        </div>

                    ))}

                </div>

            </section>


            {/* ================= ABOUT US ================= */}

            <section className="about-us">

                <h2>
                    About Us
                </h2>

                <p>
                    At My Store, we are committed to providing
                    you with the best shopping experience.
                    We offer quality products at affordable prices
                    and focus on customer satisfaction.
                </p>

            </section>


            {/* ================= FEATURES ================= */}

            <section className="features">

                <h2>
                    Why Choose Us?
                </h2>

                <ul>

                    <li>
                        ✅ Quality Products
                    </li>

                    <li>
                        ✅ Competitive Prices
                    </li>

                    <li>
                        🚚 Fast Shipping
                    </li>

                    <li>
                        💳 Secure Payments
                    </li>

                    <li>
                        ⭐ Excellent Customer Service
                    </li>

                </ul>

            </section>


            {/* ================= FOOTER ================= */}

            <footer className="footer">

                <p>
                    © 2026 My Store. All rights reserved.
                </p>


                <div className="social-links">

                    <a
                        href="https://www.facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Facebook
                    </a>


                    <a
                        href="https://www.twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Twitter
                    </a>


                    <a
                        href="https://www.instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Instagram
                    </a>

                </div>

            </footer>

        </div>
    );
}


// Export Home component
export default Home;