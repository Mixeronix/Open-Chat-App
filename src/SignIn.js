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
		<div className="bg-gray-900 w-full h-screen grid place-items-center">
			<h1 className="text-6xl text-gray-200 font-extrabold text-center ">Publiczny czat 2 LO</h1>

			<button className="sign-in bg-orange-400 text-white px-20 py-16 text-4xl font-bold" onClick={signInWithGoogle}>
				Zaloguj się z Google
			</button>
		</div>
	);
}
