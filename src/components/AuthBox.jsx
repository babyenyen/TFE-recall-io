import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export default function AuthBox() {
    const [isLogin, setIsLogin] = useState(true);

    const toggle = () => setIsLogin((prev) => !prev);

    return (
        <div className="w-full max-w-md mx-auto">
            {isLogin ? (
                <LoginForm onToggle={toggle} />
            ) : (
                <SignupForm onToggle={toggle} />
            )}
        </div>
    );
}
