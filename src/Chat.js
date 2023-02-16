import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import app from "./InitFirebase";
import { getFirestore, collection, addDoc, serverTimestamp, orderBy, limit, query, onSnapshot, deleteDoc, doc } from "firebase/firestore";

const db = getFirestore(app);

export default function Chat() {
	const scroll = useRef(null);
	const [userUid, setUid] = useState();
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		const getUid = async () => {
			setUid(Cookies.get("user"));
		};
		getUid();

		onSnapshot(query(collection(db, "Messages"), orderBy("createdAt", "desc"), limit(50)), (querySnapshot) => {
			const messages = [];
			querySnapshot.forEach((doc) => {
				messages.unshift({ data: doc.data(), id: doc.id });
			});
			scroll.current.scrollIntoView({ behavior: "smooth" });
			setMessages(messages);
		});
	}, []);

	const addMessage = async () => {
		scroll.current.scrollIntoView({ behavior: "smooth" });

		if (message.trim() !== "") {
			setMessage("");
			await addDoc(collection(db, "Messages"), {
				author: userUid,
				createdAt: serverTimestamp(),
				text: message.trim(),
			});
		}
	};

	const newLine = (index) => {
		if (index === 0) return true;
		const time = () => {
			const time = new Date((messages[index].data.createdAt.seconds - messages[index - 1].data.createdAt.seconds) * 1000);

			return time.getMinutes() > 10;
		};

		if (messages[index].data.author !== messages[index - 1].data.author || (messages[index].data.createdAt != null ? time() : false)) return true;
		else return false;
	};

	return (
		<div className="w-full h-screen ">
			<header className="bg-accent py-1 md:py-3 lg:py-4 items-center px-4 md:px-7 lg:px-10 flex fixed left-0 right-0 z-50 top-0">
				<span className="text-2xl md:text-3xl lg:text-4xl text-gray-100 font-bold text-center m-auto">Open Chat</span>
				<button
					onClick={() => {
						Cookies.remove("user");
						window.location.reload(false);
					}}
				>
					<svg xmlns="http://www.w3.org/2000/svg" height="48" width="48" fill="white" className="scale-50  lg:scale-75 xl:scale-100">
						<path d="M8.95 43.25q-1.95 0-3.35-1.375Q4.2 40.5 4.2 38.55V9.45q0-1.95 1.4-3.35Q7 4.7 8.95 4.7h14.9v4.75H8.95v29.1h14.9v4.7Zm24.4-8.7-3.4-3.3 4.9-4.9H18.1v-4.7h16.65l-4.9-4.9 3.4-3.3 10.55 10.6Z" />
					</svg>
				</button>
			</header>

			<main className="px-3 md:px-6 lg:px-7 py-14 md:py-16 bg-gray min-h-full flex flex-col">
				{messages.map((msg, index) => (
					<Message newLine={newLine(index)} owns={msg.data.author === userUid} msg={msg.data} id={msg.id} key={msg.data.text + msg.author + Math.random()} />
				))}
			</main>
			<div ref={scroll}></div>

			<form className="fixed left-0 right-0 z-50 bottom-0 flex flex-row m-3" onSubmit={() => addMessage()} target="hiddenFrame">
				<input
					className="rounded-3xl px-3 md:px-5 py-2.5 lg:px-6 h-full grow mr-4 md:mr-8 lg:mr-10 bg-gray-200 text-sm lg:text-lg"
					maxLength={1000}
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<button type="submit" className={`${!message.trim() ? "bg-gray-500" : "bg-accent"} flex aspect-auto  rounded-3xl transition-all p-2 lg:p-3`}>
					<span className="send material-symbols-outlined text-white self-center">send</span>
				</button>
			</form>
			<iframe name="hiddenFrame" width="0" height="0" border="0" title="Form hidden frame"></iframe>
		</div>
	);
}

function Message({ owns, msg, newLine, id }) {
	const deleteMessage = async () => {
		await deleteDoc(doc(db, "Messages", id));
	};

	const timeConverter = (UNIX_timestamp) => {
		var a = new Date(UNIX_timestamp * 1000);
		var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		var year = a.getFullYear();
		var month = months[a.getMonth()];
		var date = a.getDate();
		var hour = a.getHours();

		var min = a.getMinutes();
		var time = (hour < 10 ? "0" + hour.toString() : hour) + ":" + (min < 10 ? "0" + min.toString() : min) + " | " + date + " " + month + " " + year;
		return time;
	};

	if (!newLine) {
		return (
			<div className={`message flex ${owns ? "self-end flex-row-reverse" : "self-start flex-row"} mt-1 relative`}>
				<div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 p-1 sm:p-2 md:p-3 inline-block"></div>

				<span
					className={`p-2 sm:p-3 break-words max-w-xxs sm:max-w-md md:max-w-lg lg:max-w-xl text-white bg-accent mx-2 md:mx-3 text-xs sm:text-sm lg:text-base ${
						owns ? "rounded-right" : "rounded-left"
					}`}
				>
					{msg.text}
				</span>

				{owns ? (
					<svg
						fill="red"
						onClick={() => deleteMessage()}
						className="delete absolute center top-0 right-0 p-1 lg:p-2.5 h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 "
						xmlns="http://www.w3.org/2000/svg"
						height="24"
						viewBox="0 96 960 960"
						width="24"
					>
						<path d="M280 936q-33 0-56.5-23.5T200 856V336h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680 936H280Zm80-160h80V416h-80v360Zm160 0h80V416h-80v360Z" />
					</svg>
				) : null}
			</div>
		);
	} else {
		return (
			<div className={`message flex ${owns ? "self-end flex-row-reverse" : "self-start flex-row"} mt-10 relative`}>
				<img
					className={`${owns ? "user-avatar" : null} h-8 sm:h-10 lg:h-12 bg-gray-200 rounded-xl ${
						msg.author !== "iHUIItbTbsT7hqV8eenRoSSybPf1" ? `p-1 sm:p-2 md:p-3` : null
					}`}
					alt="Users avatar"
					src={
						msg.author !== "iHUIItbTbsT7hqV8eenRoSSybPf1"
							? `https://api.dicebear.com/5.x/identicon/svg?seed=${msg.author}`
							: "https://cdn.discordapp.com/avatars/675751481277677598/52d4a498e13b0877a244ad78fc77366d?size=512"
					}
				/>

				<div className="flex flex-col relative">
					<span
						className={`text-xxs h-0 md:text-xs text-gray-300 px-3 pb-1 whitespace-nowrap opacity-50 sm:opacity-70 absolute -top-3 md:-top-5 ${
							owns ? "self-end" : "self-start"
						} `}
					>
						{msg.createdAt != null ? timeConverter(msg.createdAt.seconds) : null}
					</span>
					<span
						className={`p-2 sm:p-3 break-words max-w-xxs sm:max-w-md md:max-w-lg lg:max-w-xl text-white bg-accent mx-2 md:mx-3 text-xs sm:text-sm lg:text-base ${
							owns ? "rounded-right" : "rounded-left"
						}`}
					>
						{msg.text}
					</span>
				</div>
				{owns ? (
					<svg
						fill="red"
						onClick={() => deleteMessage()}
						className="delete absolute center top-0 right-0 p-1 lg:p-2.5 h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 "
						xmlns="http://www.w3.org/2000/svg"
						height="24"
						viewBox="0 96 960 960"
						width="24"
					>
						<path d="M280 936q-33 0-56.5-23.5T200 856V336h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680 936H280Zm80-160h80V416h-80v360Zm160 0h80V416h-80v360Z" />
					</svg>
				) : null}
			</div>
		);
	}
}
