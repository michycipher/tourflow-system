import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "outline" | "store";
    size?: "sm" | "md" | "lg";
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = "primary",
    size = "md",
    className = "",
    ...props
}) => {
    const baseStyles =
        "font-semibold rounded-xl transition-all duration-300 hover:scale-105";

    const variants = {
        primary: "bg-primary  hover:bg-primary/80",
        secondary: "bg-primary/20  text-black hover:bg-primary/10",
        outline:
            "bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-700",
        store: "bg-black text-white hover:bg-gray-900",
    };

    const sizes = {
        sm: "px-4 py-2 text-[15px]",
        md: "px-6 py-2 text-base",
        lg: "px-8 py-4 text-lg",
    };

    return (
        <button
            className={`${baseStyles} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
