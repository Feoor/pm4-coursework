import { auth, onAuthStateChanged, signOut, db, doc, getDoc } from "./firebase-config.js";

let currentUser = null;
let authStateResolved = false;

// Промис, который резолвится когда Firebase определит состояние авторизации
const authStatePromise = new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            currentUser = await loadCurrentUser(user);
            console.log("Текущий пользователь:", currentUser);
        } else {
            currentUser = null;
            console.log("Пользователь не авторизован");
        }
        authStateResolved = true;
        resolve(currentUser);
    });
});

async function signOutUser() {
    try {
        await signOut(auth);
        currentUser = null;
        console.log("Пользователь вышел из системы");
    } catch (error) {
        console.error("Ошибка при выходе из системы:", error);
    }
}

async function loadCurrentUser(user) {
    if (!user) {
        return null;
    }

    const userDocRef = doc(db, "users", user.uid);
    
    try {
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            return { ...user, name: userData.name };
        } else {
            console.error("Пользователь не найден в базе данных");
            return null;
        }
    } catch (error) {
        console.error("Ошибка при загрузке данных пользователя:", error);
        return null;
    }
}

// Теперь эта функция возвращает промис
async function getCurrentUser() {
    if (authStateResolved) {
        return currentUser;
    }
    return await authStatePromise;
}

export { getCurrentUser, signOutUser };