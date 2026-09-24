import {useState} from "react";
import "./Cart.css";
import api from "../services/api";

function Cart() {
    const [cartItems, setCartItems] = useState(() =>
        JSON.parse(localStorage.getItem("cart") || "[]")
    );

    const removeFromCart = (index) => {
        const newCartItems = [...cartItems];
        newCartItems.splice(index, 1);
        setCartItems(newCartItems);
        localStorage.setItem("cart", JSON.stringify(newCartItems));
    };

    const cartTotal = cartItems.reduce((total, item) => total + Number(item.price), 0);

    const payNow = async () => {
        try {
            const response = await api.post("/payment/create-order", {
                amount: cartTotal
            });
            const order = response.data;

            if (!window.Razorpay) {
                throw new Error("Razorpay checkout is not loaded");
            }

            const razorpay = new window.Razorpay({
                key: order.keyId,
                amount: order.amount,
                currency: order.currency,
                order_id: order.id,
                handler: async (paymentResponse) => {
                    try {
                        const savedOrderResponse = await api.post("/payment/save-order", {
                            items: cartItems.map((item) => ({
                                productId: String(item.id || item._id || item.prod_name),
                                prod_name: item.prod_name,
                                price: Number(item.price),
                                quantity: 1,
                            })),
                            amount: cartTotal,
                            paymentId: paymentResponse.razorpay_payment_id,
                            orderId: order.id,
                        });

                        localStorage.setItem("cart", "[]");
                        setCartItems([]);
                        console.log("Payment successful:", paymentResponse, savedOrderResponse.data);
                        alert("Payment successful. Your order has been saved in MongoDB.");
                    } catch (saveError) {
                        console.error("Error saving order:", saveError);
                        alert(saveError.response?.data?.message || "Payment succeeded but order could not be saved.");
                    }
                }
            });

            razorpay.open();
        } catch (error) {
            console.error("Error creating order:", error);
            alert(error.response?.data?.message || error.message || "Failed to create order. Please try again.");
        }
    };

    return (
        <div className="cart-container">
            <header className="cart-header">
                <div>
                    <p className="cart-eyebrow">YOUR SELECTION</p>
                    <h1>Shopping Cart</h1>
                </div>
                <span className="cart-count">{cartItems.length} {cartItems.length === 1 ? "item" : "items"}</span>
            </header>
            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    <span className="empty-cart-icon">🛒</span>
                    <h2>Your cart is empty</h2>
                    <p>Add something fresh from the home page to see it here.</p>
                </div>
            ) : (
                <ul className="cart-list">
                    {cartItems.map((item, index) => (
                        <li key={index}>
                            <div className="cart-item-info">
                                <span className="cart-item-index">{String(index + 1).padStart(2, "0")}</span>
                                <div>
                                    <h2>{item.prod_name}</h2>
                                    <p>Fresh pick from My Store</p>
                                </div>
                            </div>
                            <strong>₹{item.price}</strong>
                            <button onClick={() => removeFromCart(index)}>
                                Remove <span aria-hidden="true">×</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            {cartItems.length > 0 && (
                <div className="cart-summary">
                    <div>
                        <span>Estimated total</span>
                        <strong>₹{cartTotal}</strong>
                    </div>
                    <button className="pay-button" onClick={payNow}>Pay now</button>
                </div>
            )}
        </div>
    );
}
export default Cart;