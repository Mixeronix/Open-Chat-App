import React from "react";
import Cookies from "js-cookie";
import Chat from "./Chat";
import SignIn from "./SignIn";

export default function App() {
	const user = Cookies.get("user");

	return user ? <Chat /> : <SignIn />;
}
