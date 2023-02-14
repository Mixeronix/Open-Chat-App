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
			<h1 className="text-6xl text-gray-100 font-extrabold text-center ">Open Chat</h1>

			<button className="sign-in bg-accent text-white px-16 py-14 text-5xl font-bold rounded-lg" onClick={signInWithGoogle}>
				Zaloguj się z Google
			</button>
		</div>
	);
}
