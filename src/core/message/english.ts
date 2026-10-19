export const enMessages = {

    errorMsg: "Something went wrong",
    fieldRequired: "All fields are required",
    emailAlready: "Email already registered",
    Internal: "Internal server error",
    emailNotFounded: "Email Not Founded.",
    incorrectPassword: "Password is incorrect.",
    loginError: "Sorry, can't login at this moment.",
    ERR_GENERIC: "ERR_GENERIC",
    token: "Token is required.",
    InvalidToken: "Invalid token.",
    mobileAlready: "Mobile Number already registered",
    CreateAccount: "User create account Successfully",
    userNotFounded: "User not found",
    Unauthorized: "Unauthorized user",
    mobileNotFounded: "Mobile Number Not Founded.",
    userLogin: "User login successfully.",
    
} as const;

export type MessageKey =
    keyof typeof enMessages;