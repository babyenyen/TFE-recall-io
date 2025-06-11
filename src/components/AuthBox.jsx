import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export default function AuthBox() {
    const [isLogin, setIsLogin] = useState(true); //Par défaut, on affiche le LoginForm
    const toggle = () => setIsLogin((prev) => !prev); //Trigger pour passe de LoginForm à SignupForm

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
