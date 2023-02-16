import React from "react";
import app from "./InitFirebase";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Cookies from "js-cookie";

const auth = getAuth(app);

export default function SignIn() {
	const signInWithGoogle = () => {
		const provider = new GoogleAuthProvider();

		signInWithPopup(auth, provider).then((result) => {
			const user = result.user;
			Cookies.set("user", user.uid);
			window.location.reload(false);
		});
	};

	return (
		<div className="bg-gray w-full h-screen grid place-items-center">
			<h1 className="text-5xl md:text-8xl text-gray-100 font-extrabold text-center ">Open Chat</h1>

			<button
				className="sign-in bg-accent text-white px-10  md:px-16 py-7  sm:py-10 md:py-14 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold rounded-lg"
				onClick={signInWithGoogle}
			>
				Zaloguj się z Google
			</button>
		</div>
	);
}
